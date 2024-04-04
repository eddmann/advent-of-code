struct Day02: AdventDay {
  var input: String

  struct RequiredGameCubes {
    let id: Int
    let red: Int
    let green: Int
    let blue: Int
  }

  func parseRequiredCubesPerGame(_ input: String) -> [RequiredGameCubes] {
    input.lines().map { line in
      return RequiredGameCubes(
        id: line.ints().first!,
        red: line.matches(of: /(\d+) red/).map { Int($0.output.1)! }.max() ?? 0,
        green: line.matches(of: /(\d+) green/).map { Int($0.output.1)! }.max() ?? 0,
        blue: line.matches(of: /(\d+) blue/).map { Int($0.output.1)! }.max() ?? 0
      )
    }
  }

  func part1() -> Any {
    parseRequiredCubesPerGame(input)
      .map { $0.red <= 12 && $0.green <= 13 && $0.blue <= 14 ? $0.id : 0 }
      .sum()
  }

  func part2() -> Any {
    parseRequiredCubesPerGame(input)
      .map { $0.red * $0.green * $0.blue }
      .sum()
  }
}
