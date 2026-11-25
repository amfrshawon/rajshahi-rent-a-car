package bd.rajshahirentacar.calllogger

import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.Service
import android.content.ContentResolver
import android.content.Context
import android.content.Intent
import android.database.ContentObserver
import android.database.sqlite.SQLiteDatabase
import android.net.ConnectivityManager
import android.net.NetworkCapabilities
import android.os.Build
import android.os.Handler
import android.os.IBinder
import android.os.Looper
import android.provider.CallLog
import android.telephony.PhoneStateListener
import android.telephony.TelephonyManager
import android.util.Log
import org.json.JSONObject
import java.io.OutputStreamWriter
import java.net.HttpURLConnection
import java.net.URL
import java.text.SimpleDateFormat
import java.util.Locale
import java.util.TimeZone
import java.util.concurrent.Executors

/**
 * Foreground service that logs every call on the business SIM to the
 * dashboard: `ringing` (for the future pop-up) and `ended` (the stored call).
 * Events are queued in SQLite first and retried when the network returns.
 */
class CallLoggerService : Service() {

    private lateinit var db: SQLiteDatabase
    private lateinit var telephony: TelephonyManager
    private val worker = Executors.newSingleThreadExecutor()
    private var ringingNumber: String? = null

    override fun onCreate() {
        super.onCreate()
        createChannel()
        startForeground(NOTIFICATION_ID, buildNotification())
        db = openOrCreateDatabase("call_queue.db", MODE_PRIVATE, null)
        db.execSQL(
            """create table if not exists queue (
                 id integer primary key autoincrement,
                 body text not null,
                 created_at integer not null)""",
        )
        listenForCalls()
        scheduleDrain()
    }

    private fun createChannel() {
        val manager = getSystemService(NotificationManager::class.java)
        manager.createNotificationChannel(
            NotificationChannel(
                CHANNEL_ID,
                "Call logging",
                NotificationManager.IMPORTANCE_LOW,
            ),
        )
    }

    private fun buildNotification(): Notification =
        Notification.Builder(this, CHANNEL_ID)
            .setContentTitle("কল লগ চালু আছে")
            .setContentText("Call logging is on")
            .setSmallIcon(android.R.drawable.ic_menu_call)
            .build()

    @Suppress("DEPRECATION")
    private fun listenForCalls() {
        telephony = getSystemService(Context.TELEPHONY_SERVICE) as TelephonyManager
        telephony.listen(object : PhoneStateListener() {
            override fun onCallStateChanged(state: Int, phoneNumber: String?) {
                if (state == TelephonyManager.CALL_STATE_RINGING && phoneNumber != null) {
                    ringingNumber = phoneNumber
                    enqueue(phoneNumber, "incoming", 0, event = "ringing")
                }
            }
        }, PhoneStateListener.LISTEN_CALL_STATE)

        contentResolver.registerContentObserver(
            CallLog.Calls.CONTENT_URI,
            true,
            object : ContentObserver(Handler(Looper.getMainLooper())) {
                override fun onChange(selfChange: Boolean) {
                    readNewestCall()
                }
            },
        )
    }

    private fun readNewestCall() {
        val projection = arrayOf(
            CallLog.Calls.NUMBER,
            CallLog.Calls.TYPE,
            CallLog.Calls.DATE,
            CallLog.Calls.DURATION,
            CallLog.Calls.PHONE_ACCOUNT_ID,
        )
        contentResolver.query(
            CallLog.Calls.CONTENT_URI,
            projection,
            null,
            null,
            "${CallLog.Calls.DATE} desc limit 1",
        )?.use { cursor ->
            if (!cursor.moveToFirst()) return
            val number = cursor.getString(0) ?: return
            val type = cursor.getInt(1)
            val date = cursor.getLong(2)
            val duration = cursor.getInt(3)
            val sim = cursor.getString(4)

            if (!matchesBusinessSim(sim)) return
            if (ringingNumber == null && sim == null) return

            val direction = when (type) {
                CallLog.Calls.MISSED_TYPE -> "missed"
                CallLog.Calls.REJECTED_TYPE -> "rejected"
                CallLog.Calls.OUTGOING_TYPE -> "outgoing"
                else -> "incoming"
            }
            enqueue(number, direction, duration, event = "ended", atMillis = date)
            ringingNumber = null
        }
    }

    private fun matchesBusinessSim(sim: String?): Boolean {
        val wanted = Config.simSubscriptionId(this)
        if (wanted < 0) return true // not configured: log every SIM
        return sim == wanted.toString()
    }

    private fun enqueue(
        number: String,
        direction: String,
        durationSec: Int,
        event: String,
        atMillis: Long = System.currentTimeMillis(),
    ) {
        val iso = SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ssXXX", Locale.US)
            .apply { timeZone = TimeZone.getDefault() }
            .format(atMillis)
        val body = JSONObject()
            .put("number", number)
            .put("direction", direction)
            .put("started_at", iso)
            .put("duration_sec", durationSec)
            .put("event", event)
            .toString()
        db.execSQL(
            "insert into queue (body, created_at) values (?, ?)",
            arrayOf(body, System.currentTimeMillis()),
        )
        scheduleDrain()
    }

    private fun scheduleDrain() {
        worker.execute {
            while (networkAvailable()) {
                val row = db.rawQuery(
                    "select id, body from queue order by id limit 1",
                    null,
                ).use { if (it.moveToFirst()) it.getLong(0) to it.getString(1) else null }
                    ?: return@execute

                if (post(row.second)) {
                    db.execSQL("delete from queue where id = ?", arrayOf(row.first))
                } else {
                    // Network came back but the request failed; retry shortly.
                    Thread.sleep(15_000)
                }
            }
        }
    }

    private fun networkAvailable(): Boolean {
        val manager = getSystemService(ConnectivityManager::class.java)
        val caps = manager.getNetworkCapabilities(manager.activeNetwork) ?: return false
        return caps.hasCapability(NetworkCapabilities.NET_CAPABILITY_INTERNET)
    }

    private fun post(body: String): Boolean {
        val url = Config.functionUrl(this)
        val key = Config.deviceKey(this)
        if (url.isEmpty() || key.isEmpty()) return false

        return try {
            val connection = (URL(url).openConnection() as HttpURLConnection).apply {
                requestMethod = "POST"
                connectTimeout = 10_000
                readTimeout = 15_000
                doOutput = true
                setRequestProperty("Content-Type", "application/json")
                setRequestProperty("x-device-key", key)
            }
            OutputStreamWriter(connection.outputStream).use { it.write(body) }
            val ok = connection.responseCode in 200..299
            connection.disconnect()
            ok
        } catch (exception: Exception) {
            Log.w(TAG, "send failed", exception)
            false
        }
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int = START_STICKY

    override fun onBind(intent: Intent?): IBinder? = null

    override fun onDestroy() {
        worker.shutdown()
        super.onDestroy()
    }

    companion object {
        private const val TAG = "CallLogger"
        private const val CHANNEL_ID = "call_logging"
        private const val NOTIFICATION_ID = 42

        fun start(context: Context) {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                context.startForegroundService(Intent(context, CallLoggerService::class.java))
            } else {
                context.startService(Intent(context, CallLoggerService::class.java))
            }
        }
    }
}
