package bd.rajshahirentacar.calllogger

import android.Manifest
import android.app.Activity
import android.os.Build
import android.os.Bundle
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

/** Settings: ingest-call URL, device key, start the service, send a test. */
class MainActivity : Activity() {

    private lateinit var urlField: EditText
    private lateinit var keyField: EditText

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

    private fun sendTest() {
        val url = Config.functionUrl(this)
        val key = Config.deviceKey(this)
        if (url.isEmpty() || key.isEmpty()) {
            Toast.makeText(this, "Set the URL and key first", Toast.LENGTH_SHORT).show()
            return
        }
        val body = JSONObject()
            .put("number", "01700000000")
            .put("direction", "incoming")
            .put("started_at", SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ssXXX", Locale.US).format(Date()))
            .put("duration_sec", 0)
            .put("event", "ended")
            .toString()

        Thread {
            val ok = try {
                val connection = (URL(url).openConnection() as HttpURLConnection).apply {
                    requestMethod = "POST"
                    doOutput = true
                    setRequestProperty("Content-Type", "application/json")
                    setRequestProperty("x-device-key", key)
                }
                OutputStreamWriter(connection.outputStream).use { it.write(body) }
                val code = connection.responseCode
                connection.disconnect()
                code in 200..299
            } catch (exception: Exception) {
                false
            }
            runOnUiThread {
                Toast.makeText(
                    this,
                    if (ok) "Test call sent" else "Send failed — check the URL and key",
                    Toast.LENGTH_SHORT,
                ).show()
            }
        }.start()
    }
}
