package expo.modules.healthsync

import android.app.Activity
import android.content.Context
import android.content.Intent
import androidx.health.connect.client.HealthConnectClient
import androidx.health.connect.client.PermissionController
import androidx.health.connect.client.permission.HealthPermission
import androidx.health.connect.client.records.ActiveCaloriesBurnedRecord
import androidx.health.connect.client.records.BodyFatRecord
import androidx.health.connect.client.records.DistanceRecord
import androidx.health.connect.client.records.ExerciseSessionRecord
import androidx.health.connect.client.records.HeartRateRecord
import androidx.health.connect.client.records.Record
import androidx.health.connect.client.records.SleepSessionRecord
import androidx.health.connect.client.records.StepsRecord
import androidx.health.connect.client.records.WeightRecord
import androidx.health.connect.client.request.ReadRecordsRequest
import androidx.health.connect.client.time.TimeRangeFilter
import expo.modules.kotlin.activityresult.AppContextActivityResultContract
import expo.modules.kotlin.activityresult.AppContextActivityResultLauncher
import expo.modules.kotlin.functions.Coroutine
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import java.io.Serializable
import java.time.Instant
import kotlin.reflect.KClass

class HealthSyncModule : Module() {
  private val supportedTypes = listOf(
    "steps", "exercise", "activeCalories", "distance", "heartRate", "sleep", "weight", "bodyFat"
  )
  private lateinit var permissionLauncher: AppContextActivityResultLauncher<HealthPermissionInput, Set<String>>

  private val context: Context
    get() = requireNotNull(appContext.reactContext) { "React context is unavailable" }

  override fun definition() = ModuleDefinition {
    Name("HealthSync")

    RegisterActivityContracts {
      permissionLauncher = registerForActivityResult(HealthPermissionContract())
    }

    AsyncFunction("getAvailability") {
      val status = HealthConnectClient.getSdkStatus(context)
      mapOf(
        "available" to (status == HealthConnectClient.SDK_AVAILABLE),
        "provider" to if (status == HealthConnectClient.SDK_AVAILABLE) "healthConnect" else "unavailable",
        "requiresInstall" to (status == HealthConnectClient.SDK_UNAVAILABLE_PROVIDER_UPDATE_REQUIRED)
      )
    }

    AsyncFunction("requestPermissions") Coroutine { types: List<String> ->
      requireAvailable()
      val requestedTypes = types.filter(supportedTypes::contains)
      val permissions = requestedTypes.mapNotNull(::permissionFor).toSet()
      val result = permissionLauncher.launch(HealthPermissionInput(HashSet(permissions)))
      val grantedTypes = requestedTypes.filter { permissionFor(it) in result }
      mapOf("granted" to grantedTypes.isNotEmpty(), "grantedTypes" to grantedTypes)
    }

    AsyncFunction("getGrantedPermissions").Coroutine<Map<String, Any>> {
      val client = requireAvailable()
      val granted = client.permissionController.getGrantedPermissions()
      val grantedTypes = supportedTypes.filter { permissionFor(it) in granted }
      mapOf("granted" to grantedTypes.isNotEmpty(), "grantedTypes" to grantedTypes)
    }

    AsyncFunction("readHealthData") Coroutine { startTime: String, endTime: String, types: List<String> ->
      val client = requireAvailable()
      val start = Instant.parse(startTime)
      val end = Instant.parse(endTime)
      val requested = types.filter(supportedTypes::contains).toSet()
      val result = mutableListOf<Map<String, Any>>()

      if ("steps" in requested) {
        readAll(client, StepsRecord::class, start, end).forEach { record ->
          result += normalize(record, "steps", record.count.toDouble(), "count")
        }
      }
      if ("exercise" in requested) {
        readAll(client, ExerciseSessionRecord::class, start, end).forEach { record ->
          result += normalize(
            record,
            "exercise",
            (record.endTime.toEpochMilli() - record.startTime.toEpochMilli()) / 1000.0,
            "seconds",
            mapOf("activityType" to record.exerciseType)
          )
        }
      }
      if ("activeCalories" in requested) {
        readAll(client, ActiveCaloriesBurnedRecord::class, start, end).forEach { record ->
          result += normalize(record, "activeCalories", record.energy.inKilocalories, "kcal")
        }
      }
      if ("distance" in requested) {
        readAll(client, DistanceRecord::class, start, end).forEach { record ->
          result += normalize(record, "distance", record.distance.inMeters, "m")
        }
      }
      if ("heartRate" in requested) {
        readAll(client, HeartRateRecord::class, start, end).forEach { record ->
          record.samples.forEachIndexed { index, sample ->
            result += mapOf(
              "externalId" to "${record.metadata.id}:$index",
              "type" to "heartRate",
              "startTime" to sample.time.toString(),
              "endTime" to sample.time.toString(),
              "value" to sample.beatsPerMinute.toDouble(),
              "unit" to "bpm",
              "sourceName" to record.metadata.dataOrigin.packageName,
              "sourceId" to record.metadata.dataOrigin.packageName
            )
          }
        }
      }
      if ("sleep" in requested) {
        readAll(client, SleepSessionRecord::class, start, end).forEach { record ->
          result += normalize(
            record,
            "sleep",
            (record.endTime.toEpochMilli() - record.startTime.toEpochMilli()) / 1000.0,
            "seconds",
            mapOf("stageCount" to record.stages.size)
          )
        }
      }
      if ("weight" in requested) {
        readAll(client, WeightRecord::class, start, end).forEach { record ->
          result += normalizeInstant(record, "weight", record.time, record.weight.inKilograms, "kg")
        }
      }
      if ("bodyFat" in requested) {
        readAll(client, BodyFatRecord::class, start, end).forEach { record ->
          result += normalizeInstant(record, "bodyFat", record.time, record.percentage.value, "percent")
        }
      }
      result
    }

    AsyncFunction("openSettings") {
      val intent = HealthConnectClient.getHealthConnectManageDataIntent(context).apply {
        addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
      }
      context.startActivity(intent)
    }
  }

  private fun requireAvailable(): HealthConnectClient {
    check(HealthConnectClient.getSdkStatus(context) == HealthConnectClient.SDK_AVAILABLE) {
      "Health Connect is not available or needs an update"
    }
    return HealthConnectClient.getOrCreate(context)
  }

  private fun permissionFor(type: String): String? = when (type) {
    "steps" -> HealthPermission.getReadPermission(StepsRecord::class)
    "exercise" -> HealthPermission.getReadPermission(ExerciseSessionRecord::class)
    "activeCalories" -> HealthPermission.getReadPermission(ActiveCaloriesBurnedRecord::class)
    "distance" -> HealthPermission.getReadPermission(DistanceRecord::class)
    "heartRate" -> HealthPermission.getReadPermission(HeartRateRecord::class)
    "sleep" -> HealthPermission.getReadPermission(SleepSessionRecord::class)
    "weight" -> HealthPermission.getReadPermission(WeightRecord::class)
    "bodyFat" -> HealthPermission.getReadPermission(BodyFatRecord::class)
    else -> null
  }

  private suspend fun <T : Record> readAll(
    client: HealthConnectClient,
    type: KClass<T>,
    start: Instant,
    end: Instant
  ): List<T> {
    val records = mutableListOf<T>()
    var pageToken: String? = null
    do {
      val response = client.readRecords(
        ReadRecordsRequest(
          recordType = type,
          timeRangeFilter = TimeRangeFilter.between(start, end),
          pageToken = pageToken
        )
      )
      records += response.records
      pageToken = response.pageToken
    } while (pageToken != null)
    return records
  }

  private fun normalize(
    record: Record,
    type: String,
    value: Double,
    unit: String,
    metadata: Map<String, Any>? = null
  ): Map<String, Any> = buildMap {
    val (startTime, endTime) = when (record) {
      is StepsRecord -> record.startTime to record.endTime
      is ExerciseSessionRecord -> record.startTime to record.endTime
      is ActiveCaloriesBurnedRecord -> record.startTime to record.endTime
      is DistanceRecord -> record.startTime to record.endTime
      is HeartRateRecord -> record.startTime to record.endTime
      is SleepSessionRecord -> record.startTime to record.endTime
      else -> error("Unsupported interval health record")
    }
    put("externalId", record.metadata.id)
    put("type", type)
    put("startTime", startTime.toString())
    put("endTime", endTime.toString())
    put("value", value)
    put("unit", unit)
    put("sourceName", record.metadata.dataOrigin.packageName)
    put("sourceId", record.metadata.dataOrigin.packageName)
    metadata?.let { put("metadata", it) }
  }

  private fun normalizeInstant(
    record: Record,
    type: String,
    time: Instant,
    value: Double,
    unit: String
  ): Map<String, Any> = mapOf(
    "externalId" to record.metadata.id,
    "type" to type,
    "startTime" to time.toString(),
    "endTime" to time.toString(),
    "value" to value,
    "unit" to unit,
    "sourceName" to record.metadata.dataOrigin.packageName,
    "sourceId" to record.metadata.dataOrigin.packageName
  )
}

private data class HealthPermissionInput(val permissions: HashSet<String>) : Serializable

private class HealthPermissionContract : AppContextActivityResultContract<HealthPermissionInput, Set<String>> {
  private val delegate = PermissionController.createRequestPermissionResultContract()

  override fun createIntent(context: Context, input: HealthPermissionInput): Intent =
    delegate.createIntent(context, input.permissions)

  override fun parseResult(input: HealthPermissionInput, resultCode: Int, intent: Intent?): Set<String> =
    if (resultCode == Activity.RESULT_CANCELED) emptySet() else delegate.parseResult(resultCode, intent)
}
