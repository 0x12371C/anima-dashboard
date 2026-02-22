// swift-tools-version: 6.2

import PackageDescription

let package = Package(
    name: "ANIMAKit",
    platforms: [
        .iOS(.v18),
        .macOS(.v15),
    ],
    products: [
        .library(name: "ANIMAProtocol", targets: ["ANIMAProtocol"]),
        .library(name: "ANIMAKit", targets: ["ANIMAKit"]),
        .library(name: "ANIMAChatUI", targets: ["ANIMAChatUI"]),
    ],
    dependencies: [
        .package(url: "https://github.com/steipete/ElevenLabsKit", exact: "0.1.0"),
        .package(url: "https://github.com/gonzalezreal/textual", exact: "0.3.1"),
    ],
    targets: [
        .target(
            name: "ANIMAProtocol",
            path: "Sources/ANIMAProtocol",
            swiftSettings: [
                .enableUpcomingFeature("StrictConcurrency"),
            ]),
        .target(
            name: "ANIMAKit",
            dependencies: [
                "ANIMAProtocol",
                .product(name: "ElevenLabsKit", package: "ElevenLabsKit"),
            ],
            path: "Sources/ANIMAKit",
            resources: [
                .process("Resources"),
            ],
            swiftSettings: [
                .enableUpcomingFeature("StrictConcurrency"),
            ]),
        .target(
            name: "ANIMAChatUI",
            dependencies: [
                "ANIMAKit",
                .product(
                    name: "Textual",
                    package: "textual",
                    condition: .when(platforms: [.macOS, .iOS])),
            ],
            path: "Sources/ANIMAChatUI",
            swiftSettings: [
                .enableUpcomingFeature("StrictConcurrency"),
            ]),
        .testTarget(
            name: "ANIMAKitTests",
            dependencies: ["ANIMAKit", "ANIMAChatUI"],
            path: "Tests/ANIMAKitTests",
            swiftSettings: [
                .enableUpcomingFeature("StrictConcurrency"),
                .enableExperimentalFeature("SwiftTesting"),
            ]),
    ])
