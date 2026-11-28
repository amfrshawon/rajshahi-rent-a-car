package bd.rajshahirentacar.calllogger

import android.content.SharedPreferences

/**
 * Settings written by MainActivity: the ingest-call URL, the device key and
 * the business SIM (subscription id).
 */
object Config {
    private const val PREFS = "call_logger"

    fun prefs(context: android.content.Context): SharedPreferences =
        context.getSharedPreferences(PREFS, android.content.Context.MODE_PRIVATE)

    fun functionUrl(context: android.content.Context): String =
        prefs(context).getString("function_url", "") ?: ""

    fun deviceKey(context: android.content.Context): String =
        prefs(context).getString("device_key", "") ?: ""

    fun simSubscriptionId(context: android.content.Context): Int =
        prefs(context).getInt("sim_subscription_id", -1)

    fun setFunctionUrl(context: android.content.Context, value: String) =
        prefs(context).edit().putString("function_url", value.trim()).apply()

    fun setDeviceKey(context: android.content.Context, value: String) =
        prefs(context).edit().putString("device_key", value.trim()).apply()

    fun setSimSubscriptionId(context: android.content.Context, value: Int) =
        prefs(context).edit().putInt("sim_subscription_id", value).apply()

    /** The service writes this every minute; the settings screen shows it. */
    fun lastHeartbeat(context: android.content.Context): Long =
        prefs(context).getLong("last_heartbeat", 0L)

    fun heartbeat(context: android.content.Context) {
        prefs(context).edit().putLong("last_heartbeat", System.currentTimeMillis()).apply()
    }
}
