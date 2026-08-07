package expo.modules.healthsync

import android.app.Activity
import android.os.Bundle
import android.text.method.LinkMovementMethod
import android.view.ViewGroup
import android.widget.LinearLayout
import android.widget.ScrollView
import android.widget.TextView

class HealthPermissionsRationaleActivity : Activity() {
  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)

    val density = resources.displayMetrics.density
    val padding = (24 * density).toInt()
    val content = LinearLayout(this).apply {
      orientation = LinearLayout.VERTICAL
      setPadding(padding, padding, padding, padding)
      addView(TextView(context).apply {
        text = "Fitness Goal health data privacy"
        textSize = 24f
        setTypeface(typeface, android.graphics.Typeface.BOLD)
      })
      addView(TextView(context).apply {
        text = """
          Fitness Goal reads only the health categories you approve, such as activity, workouts, sleep, heart rate, weight, and body fat.

          Imported records are stored in Fitness Goal's on-device database so your progress can stay current when you do not log it manually. This integration is read-only: Fitness Goal does not change or delete records in Health Connect.

          Fitness Goal does not sell health data or share imported health records with advertisers. You can stop access or change individual permissions at any time in Health Connect settings.
        """.trimIndent()
        textSize = 16f
        setPadding(0, (20 * density).toInt(), 0, 0)
        movementMethod = LinkMovementMethod.getInstance()
      })
    }
    setContentView(ScrollView(this).apply {
      addView(
        content,
        ViewGroup.LayoutParams(
          ViewGroup.LayoutParams.MATCH_PARENT,
          ViewGroup.LayoutParams.WRAP_CONTENT
        )
      )
    })
  }
}
