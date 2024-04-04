struct Day13: AdventDay {
  var input: String

  func parsePatterns(_ input: String) -> [[[Character]]] {
    input.split(separator: "\n\n").map { pattern in
      "\(pattern)".lines().map { Array($0) }
    }
  }

  func differences(pattern: [[Character]], y: Int) -> Int {
    zip(stride(from: y, through: 1, by: -1), y + 1...pattern.count)
      .map { (y1: Int, y2: Int) in
        (1...pattern[0].count)
          .filter { x in pattern[y1 - 1][x - 1] != pattern[y2 - 1][x - 1] }
          .count
      }
      .sum()
  }

  func mirror(_ permittedDifferences: Int, _ pattern: [[Character]]) -> Int {
    (1..<pattern.count).first(where: {
      differences(pattern: pattern, y: $0) == permittedDifferences
    }) ?? 0
  }

  func summarise(permittedDifferences: Int, pattern: [[Character]]) -> Int {
    mirror(permittedDifferences, pattern) * 100 + mirror(permittedDifferences, transpose(pattern))
  }

  func part1() -> Any {
    parsePatterns(input)
      .sum { summarise(permittedDifferences: 0, pattern: $0) }
  }

  func part2() -> Any {
    parsePatterns(input)
      .sum { summarise(permittedDifferences: 1, pattern: $0) }
  }
}
