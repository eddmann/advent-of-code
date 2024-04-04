import Algorithms

struct Day08: AdventDay {
  var input: String

  typealias Position = String
  typealias Mapping = [Position: Direction]

  enum Instruction {
    case LEFT, RIGHT
  }

  struct Direction {
    let left: Position, right: Position
  }

  func parseInstructionsAndMap(_ input: String) -> ([Instruction], Mapping) {
    let parts = input.split(separator: "\n\n")
    let instructions: [Instruction] = parts[0].map { $0 == "L" ? .LEFT : .RIGHT }
    let map = "\(parts[1])"
      .lines()
      .map { line in
        let (_, position, left, right) = try! /([A-Z0-9]{3}).*([A-Z0-9]{3}).*([A-Z0-9]{3})/
          .firstMatch(in: line)!.output
        return ("\(position)", Direction(left: "\(left)", right: "\(right)"))
      }

    return (instructions, Dictionary(uniqueKeysWithValues: map))
  }

  func countSteps(_ instructions: [Instruction], _ map: Mapping, initial: Position) -> Int {
    var position = initial

    for (steps, instruction) in instructions.cycled().enumerated() {
      position = instruction == .LEFT ? map[position]!.left : map[position]!.right

      if position.last! == "Z" {
        return steps + 1
      }
    }

    return 0
  }

  func part1() -> Any {
    let (instructions, map) = parseInstructionsAndMap(input)
    return countSteps(instructions, map, initial: "AAA")
  }

  func part2() -> Any {
    func gcd(_ a: Int, _ b: Int) -> Int { b == 0 ? a : gcd(b, a % b) }
    func lcm(_ a: Int, _ b: Int) -> Int { a / gcd(a, b) * b }

    let (instructions, map) = parseInstructionsAndMap(input)

    return map
      .keys
      .filter { $0.last! == "A" }
      .map { countSteps(instructions, map, initial: $0) }
      .reduce(1, lcm)
  }
}
