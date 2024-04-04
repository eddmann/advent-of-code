var cache = [Record: Int]()

struct Record: Hashable {
  let springs: String
  let criteria: [Int]

  init(_ springs: String, _ criteria: [Int]) {
    self.springs = springs
    self.criteria = criteria
  }

  func damaged(_ groupSize: Int) -> Record {
    return Record(
      String(self.springs.dropFirst(groupSize + 1)),
      Array(self.criteria.dropFirst())
    )
  }

  func operational() -> Record {
    return Record(String(self.springs.dropFirst()), self.criteria)
  }

  func hash(into hasher: inout Hasher) {
    hasher.combine(springs)
    hasher.combine(criteria)
  }
}

struct Day12: AdventDay {
  var input: String

  func parseRecords(_ input: String) -> [Record] {
    input.lines().map { line in
      let springsAndCriteria = line.split(separator: " ", maxSplits: 2)
      return Record("\(springsAndCriteria[0])", "\(springsAndCriteria[1])".ints())
    }
  }

  func damagedSpring(_ record: Record) -> Int {
    let groupSize = record.criteria.first!

    let potentialGroup = record.springs.prefix(groupSize).replacingOccurrences(of: "?", with: "#")

    if potentialGroup != String(repeating: "#", count: groupSize) {
      return 0
    }

    if record.springs.count == groupSize {
      return record.criteria.count == 1 ? 1 : 0
    }

    if record.springs[record.springs.index(record.springs.startIndex, offsetBy: groupSize)] != "#" {
      return arrangements(record.damaged(groupSize))
    }

    return 0
  }

  func arrangements(_ record: Record) -> Int {
    let result = cache[record]

    if let result = result {
      return result
    }

    if record.criteria.isEmpty {
      return record.springs.allSatisfy({ $0 != "#" }) ? 1 : 0
    }

    if record.springs.isEmpty {
      return 0
    }

    let nextCharacter = record.springs.prefix(1)
    var value = 0

    if nextCharacter == "#" {
      value = damagedSpring(record)
    } else if nextCharacter == "." {
      value = arrangements(record.operational())
    } else {
      value = damagedSpring(record) + arrangements(record.operational())
    }

    cache[record] = value

    return value
  }

  func part1() -> Any {
    return parseRecords(input)
      .map { arrangements($0) }
      .sum()
  }

  func part2() -> Any {
    return parseRecords(input)
      .map {
        arrangements(
          Record(
            Array(repeating: $0.springs, count: 5).joined(separator: "?"),
            Array(Array(repeating: $0.criteria, count: 5).joined())
          )
        )
      }
      .sum()
  }
}
