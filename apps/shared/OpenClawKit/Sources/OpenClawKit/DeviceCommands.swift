import Foundation

public enum ANIMADeviceCommand: String, Codable, Sendable {
    case status = "device.status"
    case info = "device.info"
}

public enum ANIMABatteryState: String, Codable, Sendable {
    case unknown
    case unplugged
    case charging
    case full
}

public enum ANIMAThermalState: String, Codable, Sendable {
    case nominal
    case fair
    case serious
    case critical
}

public enum ANIMANetworkPathStatus: String, Codable, Sendable {
    case satisfied
    case unsatisfied
    case requiresConnection
}

public enum ANIMANetworkInterfaceType: String, Codable, Sendable {
    case wifi
    case cellular
    case wired
    case other
}

public struct ANIMABatteryStatusPayload: Codable, Sendable, Equatable {
    public var level: Double?
    public var state: ANIMABatteryState
    public var lowPowerModeEnabled: Bool

    public init(level: Double?, state: ANIMABatteryState, lowPowerModeEnabled: Bool) {
        self.level = level
        self.state = state
        self.lowPowerModeEnabled = lowPowerModeEnabled
    }
}

public struct ANIMAThermalStatusPayload: Codable, Sendable, Equatable {
    public var state: ANIMAThermalState

    public init(state: ANIMAThermalState) {
        self.state = state
    }
}

public struct ANIMAStorageStatusPayload: Codable, Sendable, Equatable {
    public var totalBytes: Int64
    public var freeBytes: Int64
    public var usedBytes: Int64

    public init(totalBytes: Int64, freeBytes: Int64, usedBytes: Int64) {
        self.totalBytes = totalBytes
        self.freeBytes = freeBytes
        self.usedBytes = usedBytes
    }
}

public struct ANIMANetworkStatusPayload: Codable, Sendable, Equatable {
    public var status: ANIMANetworkPathStatus
    public var isExpensive: Bool
    public var isConstrained: Bool
    public var interfaces: [ANIMANetworkInterfaceType]

    public init(
        status: ANIMANetworkPathStatus,
        isExpensive: Bool,
        isConstrained: Bool,
        interfaces: [ANIMANetworkInterfaceType])
    {
        self.status = status
        self.isExpensive = isExpensive
        self.isConstrained = isConstrained
        self.interfaces = interfaces
    }
}

public struct ANIMADeviceStatusPayload: Codable, Sendable, Equatable {
    public var battery: ANIMABatteryStatusPayload
    public var thermal: ANIMAThermalStatusPayload
    public var storage: ANIMAStorageStatusPayload
    public var network: ANIMANetworkStatusPayload
    public var uptimeSeconds: Double

    public init(
        battery: ANIMABatteryStatusPayload,
        thermal: ANIMAThermalStatusPayload,
        storage: ANIMAStorageStatusPayload,
        network: ANIMANetworkStatusPayload,
        uptimeSeconds: Double)
    {
        self.battery = battery
        self.thermal = thermal
        self.storage = storage
        self.network = network
        self.uptimeSeconds = uptimeSeconds
    }
}

public struct ANIMADeviceInfoPayload: Codable, Sendable, Equatable {
    public var deviceName: String
    public var modelIdentifier: String
    public var systemName: String
    public var systemVersion: String
    public var appVersion: String
    public var appBuild: String
    public var locale: String

    public init(
        deviceName: String,
        modelIdentifier: String,
        systemName: String,
        systemVersion: String,
        appVersion: String,
        appBuild: String,
        locale: String)
    {
        self.deviceName = deviceName
        self.modelIdentifier = modelIdentifier
        self.systemName = systemName
        self.systemVersion = systemVersion
        self.appVersion = appVersion
        self.appBuild = appBuild
        self.locale = locale
    }
}
