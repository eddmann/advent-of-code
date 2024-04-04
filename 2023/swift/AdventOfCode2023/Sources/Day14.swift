struct Day14: AdventDay {
  var input: String

  typealias Dish = [[Character]]

  func parseDish(_ input: String) -> [[Character]] {
    input.lines().map { Array($0) }
  }

  func tilt(_ dish: Dish) -> Dish {
    dish.map { row in
      var buffer = [Character]()
      var output = [Character]()

      for chr in row {
        if chr == "#" {
          output.append(contentsOf: buffer.sorted(by: >))
          output.append(chr)
          buffer.removeAll()
        } else {
          buffer.append(chr)
        }
      }

      output.append(contentsOf: buffer.sorted(by: >))

      return output
    }
  }

  func totalLoad(_ dish: Dish) -> Int {
    dish.reversed().enumerated().map { (idx, row) in
      (idx + 1) * row.filter { $0 == "O" }.count
    }.sum()
  }

  func cycle(_ dish: Dish) -> Dish {
    let cycled = (1...4).reduce(transpose(dish)) { dish, _ in
      transpose(tilt(dish).map { $0.reversed() })
    }
    return transpose(cycled)
  }

  func part1() -> Any {
    let dish = parseDish(input)
    let tiltedDish = transpose(tilt(transpose(dish)))
    return totalLoad(tiltedDish)
  }

  func part2() -> Any {
    let initialDish = parseDish(input)

    var seen = [Dish: Int]()
    var history = [Dish]()
    var dish = initialDish
    var idx = 0

    while true {
      if let cycleStart = seen[dish] {
        let cycleLength = idx - cycleStart
        let cyclePosition = cycleStart + (1_000_000_000 - cycleStart) % cycleLength
        return totalLoad(history[cyclePosition])
      }

      seen[dish] = idx
      history.append(dish)

      dish = cycle(dish)
      idx += 1
    }
  }
}
