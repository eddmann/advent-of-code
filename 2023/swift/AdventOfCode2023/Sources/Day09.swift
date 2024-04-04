import Algorithms

struct Day09: AdventDay {
  var input: String

  func parseReport(_ input: String) -> [[Int]] {
    input.lines().map { $0.ints() }
  }

  func extrapolate(_ history: [Int]) -> Int {
    if history.allSatisfy({ $0 == 0 }) {
      return 0
    }

    let diffs = history.windows(ofCount: 2).map { pair in pair.last! - pair.first! }

    return history.last! + extrapolate(diffs)
  }

  func part1() -> Any {
    parseReport(input)
      .map(extrapolate)
      .sum()
  }

  func part2() -> Any {
    parseReport(input)
      .map { $0.reversed() }
      .map(extrapolate)
      .sum()
  }
}
