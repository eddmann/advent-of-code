// swift-tools-version: 5.8
import PackageDescription

let dependencies: [Target.Dependency] = [
    .product(name: "Algorithms", package: "swift-algorithms"),
    .product(name: "Collections", package: "swift-collections"),
    .product(name: "ArgumentParser", package: "swift-argument-parser"),
    .product(name: "SwiftZ3", package: "swift-z3"),
]

let package = Package(
    name: "AdventOfCode",
    platforms: [.macOS(.v13)],
    dependencies: [
        .package(
            url: "https://github.com/apple/swift-algorithms.git",
            .upToNextMajor(from: "1.2.0")),
        .package(
            url: "https://github.com/apple/swift-collections.git",
            .upToNextMajor(from: "1.0.0")),
        .package(
            url: "https://github.com/apple/swift-argument-parser.git",
            .upToNextMajor(from: "1.2.0")),
        .package(
            url: "https://github.com/apple/swift-format.git",
            .upToNextMajor(from: "509.0.0")),
        .package(
            url: "https://github.com/LuizZak/swift-z3.git",
            branch: "master")
    ],
    targets: [
        .executableTarget(
            name: "AdventOfCode",
            dependencies: dependencies,
            path: "Sources",
            resources: [.copy("Input")],
            swiftSettings: [.enableUpcomingFeature("BareSlashRegexLiterals")]
        ),
        .testTarget(
            name: "AdventOfCodeTests",
            dependencies: ["AdventOfCode"] + dependencies,
            path: "Tests",
            swiftSettings: [.enableUpcomingFeature("BareSlashRegexLiterals")]
        )
    ]
)
