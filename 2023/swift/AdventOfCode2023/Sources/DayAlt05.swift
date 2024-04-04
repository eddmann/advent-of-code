struct DayAlt05: AdventDay {
  var input: String

  typealias Seeds = [Int]
  typealias Map = [MapRange]

  struct SeedRange {
    let start: Int
    let length: Int

    func contains(_ value: Int) -> Bool {
      value >= start && value < start + length
    }

    static func from(seeds: Seeds) -> [SeedRange] {
      seeds.chunked(into: 2).map { SeedRange(start: $0[0], length: $0[1]) }
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

  func part1() -> Any {
    let (seeds, mappings) = parseAlmanac(from: input)
    return seeds.map { toLocation(using: mappings, for: $0) }.min()!
  }

  // 33.24 seconds
  func part2() async -> Any {
    let (seeds, mappings) = parseAlmanac(from: input)
    let seedsRanges = SeedRange.from(seeds: seeds).flatMap { range in
      let end = range.start + range.length
      var current = range.start
      var ranges = [ClosedRange<Int>]()

      while current + 50_000_000 < end {
        ranges.append(current...current + 50_000_000)
        current += 50_000_000
      }

      ranges.append(current...end)

      return ranges
    }

    return await seedsRanges.parallelMap { range in
      range.map { toLocation(using: mappings, for: $0) }.min()!
    }.min()!
  }
}
