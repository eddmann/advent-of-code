import Foundation

let input = read(file: "input")

typealias Seeds = [Int]
typealias Map = [MapRange]

struct SeedRange  {
    let start: Int
    let length: Int
    
    func contains(_ value: Int) -> Bool {
        value >= start && value < start + length
    }
    
    static func from(seeds: Seeds) -> [SeedRange] {
        seeds.chunked(into: 2).map { SeedRange(start: $0[0], length: $0[1] )}
    }
}

struct MapRange {
    let source: Int
    let destination: Int
    let length: Int
    
    func forwards(_ value: Int) -> Int? {
        value >= source && value < source + length
            ? destination + value - source
            : nil
    }
    
    func backwards(_ value: Int) -> Int? {
        value >= destination && value < destination + length
            ? source + value - destination
            : nil
    }
}

func parseAlmanac(from input: String) -> (Seeds, [Map]) {
    let parsed = input.split(separator: /[^0-9]+:/)
    
    let seeds = "\(parsed[0])".ints()
    let maps = parsed.dropFirst().map { map in
        "\(map)".ints().chunked(into: 3).map {
            MapRange(source: $0[1], destination: $0[0], length: $0[2])
        }
    }
    
    return (seeds, maps)
}

func toLocation(using maps: [Map], for seed: Int) -> Int {
    maps.reduce(seed) { value, map in
        for range in map {
            if let mapped = range.forwards(value) {
                return mapped
            }
        }
        return value
    }
}

func toSeed(using maps: [Map], for location: Int) -> Int {
    maps.reversed().reduce(location) { value, map in
        for range in map {
            if let mapped = range.backwards(value) {
                return mapped
            }
        }
        return value
    }
}

func partOne() -> CustomStringConvertible {
    let (seeds, mappings) = parseAlmanac(from: input)
    return seeds.map { toLocation(using: mappings, for: $0 )}.min()!
}

func partTwo() -> CustomStringConvertible {
    let (seeds, mappings) = parseAlmanac(from: input)
    let seedsRanges = SeedRange.from(seeds: seeds)
    
    var location = 0
    while true {
        let seed = toSeed(using: mappings, for: location)
        if seedsRanges.contains(where: { $0.contains(seed) }) {
            return location
        }
        location += 1
    }
}

print(partOne())
print(partTwo())
