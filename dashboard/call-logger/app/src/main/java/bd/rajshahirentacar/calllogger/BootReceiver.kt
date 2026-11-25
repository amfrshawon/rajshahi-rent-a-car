package bd.rajshahirentacar.calllogger

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent

/** The logger must survive a reboot. */
class BootReceiver : BroadcastReceiver() {
    override fun onReceive(context: Context, intent: Intent) {
        if (intent.action == Intent.ACTION_BOOT_COMPLETED) {
            CallLoggerService.start(context)
        }
    }
}
