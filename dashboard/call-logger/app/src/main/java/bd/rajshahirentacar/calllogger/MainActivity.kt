package bd.rajshahirentacar.calllogger

import android.Manifest
import android.app.Activity
import android.content.pm.PackageManager
import android.os.Bundle
import android.os.Handler
import android.os.Looper
import android.provider.CallLog
import android.widget.Button
import android.widget.EditText
import android.widget.LinearLayout
import android.widget.TextView
import android.widget.Toast
import org.json.JSONObject
import java.io.OutputStreamWriter
import java.net.HttpURLConnection
import java.net.URL
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

/** Settings: ingest-call URL, device key, start the service, diagnostics. */
class MainActivity : Activity() {

    private lateinit var urlField: EditText
    private lateinit var keyField: EditText
    private lateinit var status: TextView
    private lateinit var action: TextView
    private val handler = Handler(Looper.getMainLooper())
    private val refresh = object : Runnable {
        override fun run() {
            renderStatus()
            handler.postDelayed(this, 2000)
        }
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        val layout = LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
            setPadding(48, 48, 48, 48)
        }
        layout.addView(TextView(this).apply { text = "Rajshahi Rent A Car — call logger" })
        layout.addView(TextView(this).apply { text = "Ingest URL" })
        urlField = EditText(this).apply {
            setText(Config.functionUrl(this@MainActivity))
            hint = "https://…/functions/v1/ingest-call"
        }
        layout.addView(urlField)
        layout.addView(TextView(this).apply { text = "Device key (from dashboard Settings)" })
        keyField = EditText(this).apply {
            setText(Config.deviceKey(this@MainActivity))
        }
        layout.addView(keyField)

        layout.addView(Button(this).apply {
            text = "Save and start logging"
            setOnClickListener {
                Config.setFunctionUrl(this@MainActivity, urlField.text.toString())
                Config.setDeviceKey(this@MainActivity, keyField.text.toString())
                CallLoggerService.start(this@MainActivity)
                Toast.makeText(this@MainActivity, "Saved — logging started", Toast.LENGTH_SHORT).show()
            }
        })
        layout.addView(Button(this).apply {
            text = "Send test call"
            setOnClickListener { sendTest() }
        })
        layout.addView(Button(this).apply {
            text = "Read latest call & send"
            setOnClickListener { sendLatest() }
        })

        status = TextView(this).apply { setPadding(0, 32, 0, 0) }
        action = TextView(this).apply { setPadding(0, 16, 0, 0) }
        layout.addView(status)
        layout.addView(action)
        renderStatus()

        setContentView(layout)
        requestPermissions(
            arrayOf(
                Manifest.permission.READ_PHONE_STATE,
                Manifest.permission.READ_CALL_LOG,
                Manifest.permission.POST_NOTIFICATIONS,
            ),
            1,
        )
    }

    private fun granted(permission: String) =
        checkSelfPermission(permission) == PackageManager.PERMISSION_GRANTED

    private fun renderStatus() {
        val phone = granted(Manifest.permission.READ_PHONE_STATE)
        val callLog = granted(Manifest.permission.READ_CALL_LOG)
        val last = Config.lastHeartbeat(this)
        val ageSec = (System.currentTimeMillis() - last) / 1000
        val service = when {
            last == 0L -> "never started"
            ageSec < 120 -> "running (${ageSec}s ago)"
            else -> "stopped (${ageSec / 60}m ago)"
        }
        val error = Config.lastError(this)
        status.text = buildString {
            appendLine("Phone state: ${if (phone) "granted" else "MISSING"}")
            appendLine("Call log: ${if (callLog) "granted" else "MISSING"}")
            appendLine("Service: $service")
            append("Queue: ${queueCount()}")
            if (error.isNotEmpty()) append("\nError: $error")
        }
    }

    private fun queueCount(): Int = try {
        openOrCreateDatabase("call_queue.db", MODE_PRIVATE, null).use { db ->
            db.rawQuery("select count(*) from queue", null).use { cursor ->
                if (cursor.moveToFirst()) cursor.getInt(0) else 0
            }
        }
    } catch (exception: Exception) {
        0
    }

    override fun onResume() {
        super.onResume()
        handler.post(refresh)
    }

    override fun onPause() {
        super.onPause()
        handler.removeCallbacks(refresh)
    }

    /** Reads the newest CallLog entry, shows it, and posts it as ended. */
    private fun sendLatest() {
        if (!granted(Manifest.permission.READ_CALL_LOG)) {
            action.text = "Call log permission is MISSING — grant it in Settings → Apps"
            return
        }
        val projection = arrayOf(
            CallLog.Calls.NUMBER,
            CallLog.Calls.TYPE,
            CallLog.Calls.DATE,
            CallLog.Calls.DURATION,
            CallLog.Calls.PHONE_ACCOUNT_ID,
        )
        Thread {
            val summary = try {
                contentResolver.query(
                    CallLog.Calls.CONTENT_URI,
                    projection,
                    null,
                    null,
                    "${CallLog.Calls.DATE} desc limit 1",
                )?.use { cursor ->
                    if (!cursor.moveToFirst()) {
                        "Call log is empty"
                    } else {
                        val number = cursor.getString(0) ?: "(hidden)"
                        val type = cursor.getInt(1)
                        val date = cursor.getLong(2)
                        val duration = cursor.getInt(3)
                        val sim = cursor.getString(4)
                        val direction = when (type) {
                            CallLog.Calls.MISSED_TYPE -> "missed"
                            CallLog.Calls.REJECTED_TYPE -> "rejected"
                            CallLog.Calls.OUTGOING_TYPE -> "outgoing"
                            else -> "incoming"
                        }
                        val iso = SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ssXXX", Locale.US)
                            .format(Date(date))
                        val body = JSONObject()
                            .put("number", number)
                            .put("direction", direction)
                            .put("started_at", iso)
                            .put("duration_sec", duration)
                            .put("event", "ended")
                            .toString()
                        val ok = post(body)
                        "Latest: $number · $direction · ${duration}s · sim=$sim → " +
                            if (ok) "sent ✓" else "send failed"
                    }
                } ?: "Call log returned nothing"
            } catch (exception: Exception) {
                Config.setLastError(this, "read: ${exception.message}")
                "Read failed: ${exception.message}"
            }
            runOnUiThread { action.text = summary }
        }.start()
    }

    private fun sendTest() {
        val body = JSONObject()
            .put("number", "01700000000")
            .put("direction", "incoming")
            .put("started_at", SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ssXXX", Locale.US).format(Date()))
            .put("duration_sec", 0)
            .put("event", "ended")
            .toString()

        Thread {
            val ok = post(body)
            runOnUiThread {
                Toast.makeText(
                    this,
                    if (ok) "Test call sent" else "Send failed — check the URL and key",
                    Toast.LENGTH_SHORT,
                ).show()
            }
        }.start()
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
            val code = connection.responseCode
            connection.disconnect()
            code in 200..299
        } catch (exception: Exception) {
            Config.setLastError(this, "post: ${exception.message}")
            false
        }
    }
}
