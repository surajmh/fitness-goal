import ExpoModulesCore
import HealthKit
import UIKit

public class HealthSyncModule: Module {
  private let healthStore = HKHealthStore()
  private let supportedTypes = [
    "steps", "exercise", "activeCalories", "distance", "heartRate", "sleep", "weight", "bodyFat"
  ]

  public func definition() -> ModuleDefinition {
    Name("HealthSync")

    AsyncFunction("getAvailability") { () -> [String: Any] in
      [
        "available": HKHealthStore.isHealthDataAvailable(),
        "provider": HKHealthStore.isHealthDataAvailable() ? "appleHealth" : "unavailable"
      ]
    }

    AsyncFunction("requestPermissions") { (types: [String], promise: Promise) in
      guard HKHealthStore.isHealthDataAvailable() else {
        promise.resolve(["granted": false, "grantedTypes": []])
        return
      }
      let requested = self.sampleTypes(for: types)
      self.healthStore.requestAuthorization(toShare: [], read: requested) { success, error in
        if let error {
          promise.reject("ERR_HEALTH_PERMISSION", error.localizedDescription)
          return
        }
        promise.resolve([
          "granted": success,
          // HealthKit intentionally does not reveal individual read decisions.
          "grantedTypes": success ? types.filter(self.supportedTypes.contains) : []
        ])
      }
    }

    AsyncFunction("getGrantedPermissions") { (promise: Promise) in
      let requested = self.sampleTypes(for: self.supportedTypes)
      self.healthStore.getRequestStatusForAuthorization(toShare: [], read: requested) { status, error in
        if let error {
          promise.reject("ERR_HEALTH_PERMISSION_STATUS", error.localizedDescription)
          return
        }
        let previouslyRequested = status == .unnecessary
        promise.resolve([
          "granted": previouslyRequested,
          "grantedTypes": previouslyRequested ? self.supportedTypes : []
        ])
      }
    }

    AsyncFunction("readHealthData") { (startTime: String, endTime: String, types: [String], promise: Promise) in
      guard
        let start = ISO8601DateFormatter.healthSync.date(from: startTime),
        let end = ISO8601DateFormatter.healthSync.date(from: endTime)
      else {
        promise.reject("ERR_HEALTH_DATE", "Health sync dates must be ISO-8601 values")
        return
      }
      self.readSamples(from: start, to: end, types: types, promise: promise)
    }

    AsyncFunction("openSettings") { (promise: Promise) in
      DispatchQueue.main.async {
        guard let url = URL(string: UIApplication.openSettingsURLString) else {
          promise.resolve(nil)
          return
        }
        UIApplication.shared.open(url) { _ in promise.resolve(nil) }
      }
    }
  }

  private func sampleTypes(for names: [String]) -> Set<HKObjectType> {
    Set(names.compactMap { sampleType(for: $0) })
  }

  private func sampleType(for name: String) -> HKSampleType? {
    switch name {
    case "steps": return HKQuantityType.quantityType(forIdentifier: .stepCount)
    case "exercise": return HKObjectType.workoutType()
    case "activeCalories": return HKQuantityType.quantityType(forIdentifier: .activeEnergyBurned)
    case "distance": return HKQuantityType.quantityType(forIdentifier: .distanceWalkingRunning)
    case "heartRate": return HKQuantityType.quantityType(forIdentifier: .heartRate)
    case "sleep": return HKCategoryType.categoryType(forIdentifier: .sleepAnalysis)
    case "weight": return HKQuantityType.quantityType(forIdentifier: .bodyMass)
    case "bodyFat": return HKQuantityType.quantityType(forIdentifier: .bodyFatPercentage)
    default: return nil
    }
  }

  private func readSamples(from start: Date, to end: Date, types: [String], promise: Promise) {
    let group = DispatchGroup()
    let lock = NSLock()
    var records: [[String: Any]] = []
    var firstError: Error?
    let predicate = HKQuery.predicateForSamples(withStart: start, end: end, options: .strictStartDate)

    for name in types.filter(supportedTypes.contains) {
      guard let type = sampleType(for: name) else { continue }
      group.enter()
      let query = HKSampleQuery(
        sampleType: type,
        predicate: predicate,
        limit: HKObjectQueryNoLimit,
        sortDescriptors: nil
      ) { _, samples, error in
        lock.lock()
        defer {
          lock.unlock()
          group.leave()
        }
        if let error {
          firstError = firstError ?? error
          return
        }
        records.append(contentsOf: (samples ?? []).compactMap { self.normalize($0, as: name) })
      }
      healthStore.execute(query)
    }

    group.notify(queue: .global(qos: .userInitiated)) {
      if let firstError {
        promise.reject("ERR_HEALTH_READ", firstError.localizedDescription)
      } else {
        promise.resolve(records)
      }
    }
  }

  private func normalize(_ sample: HKSample, as name: String) -> [String: Any]? {
    var record: [String: Any] = [
      "externalId": sample.uuid.uuidString,
      "type": name,
      "startTime": ISO8601DateFormatter.healthSync.string(from: sample.startDate),
      "endTime": ISO8601DateFormatter.healthSync.string(from: sample.endDate),
      "sourceName": sample.sourceRevision.source.name,
      "sourceId": sample.sourceRevision.source.bundleIdentifier
    ]

    if let quantity = sample as? HKQuantitySample,
       let measurement = measurement(for: name, quantity: quantity.quantity) {
      record["value"] = measurement.value
      record["unit"] = measurement.unit
    } else if let sleep = sample as? HKCategorySample {
      record["value"] = sample.endDate.timeIntervalSince(sample.startDate)
      record["unit"] = "seconds"
      record["metadata"] = ["stage": sleepStageName(sleep.value)]
    } else if let workout = sample as? HKWorkout {
      record["value"] = workout.duration
      record["unit"] = "seconds"
      record["metadata"] = ["activityType": workout.workoutActivityType.rawValue]
    }
    return record
  }

  private func measurement(for name: String, quantity: HKQuantity) -> (value: Double, unit: String)? {
    switch name {
    case "steps": return (quantity.doubleValue(for: .count()), "count")
    case "activeCalories": return (quantity.doubleValue(for: .kilocalorie()), "kcal")
    case "distance": return (quantity.doubleValue(for: .meter()), "m")
    case "heartRate": return (quantity.doubleValue(for: HKUnit.count().unitDivided(by: .minute())), "bpm")
    case "weight": return (quantity.doubleValue(for: .gramUnit(with: .kilo)), "kg")
    case "bodyFat": return (quantity.doubleValue(for: .percent()) * 100, "percent")
    default: return nil
    }
  }

  private func sleepStageName(_ value: Int) -> String {
    switch value {
    case HKCategoryValueSleepAnalysis.awake.rawValue: return "awake"
    case HKCategoryValueSleepAnalysis.asleepCore.rawValue: return "core"
    case HKCategoryValueSleepAnalysis.asleepDeep.rawValue: return "deep"
    case HKCategoryValueSleepAnalysis.asleepREM.rawValue: return "rem"
    case HKCategoryValueSleepAnalysis.inBed.rawValue: return "inBed"
    default: return "asleep"
    }
  }
}

private extension ISO8601DateFormatter {
  static let healthSync: ISO8601DateFormatter = {
    let formatter = ISO8601DateFormatter()
    formatter.formatOptions = [.withInternetDateTime, .withFractionalSeconds]
    return formatter
  }()
}
