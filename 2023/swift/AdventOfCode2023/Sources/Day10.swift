import Collections

precedencegroup CompositionPrecedence {
  associativity: left
}

infix operator >>> : CompositionPrecedence

func >>> <T, U, V>(lhs: @escaping (T) -> U, rhs: @escaping (U) -> V) -> (T) -> V {
  return { rhs(lhs($0)) }
}

struct Day10: AdventDay {
  var input: String

  typealias Sketch = [Square: Character]

  enum Direction {
    case UP, DOWN, LEFT, RIGHT
  }

  struct Square: Hashable {
    let y: Int, x: Int

    func go(_ direction: Direction) -> Square {
      switch direction {
      case .UP: return Square(y: y - 1, x: x)
      case .DOWN: return Square(y: y + 1, x: x)
      case .LEFT: return Square(y: y, x: x - 1)
      case .RIGHT: return Square(y: y, x: x + 1)
      }
    }
  }

  struct Location: Equatable {
    let position: Square, direction: Direction

    func with(direction nextDirection: Direction) -> Location {
      Location(position: position, direction: nextDirection)
    }

    func step() -> Location {
      Location(position: position.go(direction), direction: direction)
    }
  }

  func parseSketch(_ input: String) -> Sketch {
    let elements = input.lines().enumerated().flatMap { (y, row) in
      row.enumerated().map { x, el in
        (Square(y: y, x: x), el)
      }
    }
    return Dictionary(uniqueKeysWithValues: elements)
  }

  func findAndFillStartingPipe(_ sketch: Sketch) -> (Sketch, Location) {
    let start = sketch.first(where: { $0.value == "S" })!.key

    let up = ["|", "7", "F"].contains(sketch[start.go(.UP)])
    let down = ["|", "L", "J"].contains(sketch[start.go(.DOWN)])
    let left = ["-", "L", "F"].contains(sketch[start.go(.LEFT)])
    let right = ["-", "7", "J"].contains(sketch[start.go(.RIGHT)])

    var nextSketch = sketch

    if up && right {
      nextSketch.updateValue("L", forKey: start)
      return (nextSketch, Location(position: start, direction: .RIGHT))
    }

    if up && left {
      nextSketch.updateValue("J", forKey: start)
      return (nextSketch, Location(position: start, direction: .LEFT))
    }

    if up && down {
      nextSketch.updateValue("|", forKey: start)
      return (nextSketch, Location(position: start, direction: .UP))
    }

    if down && right {
      nextSketch.updateValue("F", forKey: start)
      return (nextSketch, Location(position: start, direction: .RIGHT))
    }

    if down && left {
      nextSketch.updateValue("7", forKey: start)
      return (nextSketch, Location(position: start, direction: .LEFT))
    }

    nextSketch.updateValue("-", forKey: start)
    return (nextSketch, Location(position: start, direction: .RIGHT))
  }

  func nextStep(sketch: Sketch, location: Location) -> Location {
    let nextLocation = location.step()
    let nextValue = sketch[nextLocation.position]!

    if nextValue == "7" && location.direction == .UP { return nextLocation.with(direction: .LEFT) }
    if nextValue == "7" && location.direction == .RIGHT {
      return nextLocation.with(direction: .DOWN)
    }
    if nextValue == "F" && location.direction == .UP { return nextLocation.with(direction: .RIGHT) }
    if nextValue == "F" && location.direction == .LEFT {
      return nextLocation.with(direction: .DOWN)
    }
    if nextValue == "L" && location.direction == .LEFT { return nextLocation.with(direction: .UP) }
    if nextValue == "L" && location.direction == .DOWN {
      return nextLocation.with(direction: .RIGHT)
    }
    if nextValue == "J" && location.direction == .DOWN {
      return nextLocation.with(direction: .LEFT)
    }
    if nextValue == "J" && location.direction == .RIGHT { return nextLocation.with(direction: .UP) }
    return nextLocation
  }

  func traversePipes(sketch: Sketch, initial: Location) -> [Square] {
    var route = [Square]()
    var current = initial

    repeat {
      route.append(current.position)
      current = nextStep(sketch: sketch, location: current)
    } while current != initial

    return route
  }

  func remoteUnconnectedPipes(sketch: Sketch) -> Sketch {
    let (completeSketch, start) = findAndFillStartingPipe(sketch)
    let route = traversePipes(sketch: completeSketch, initial: start)

    var cleanSketch = completeSketch
    for (pos, _) in completeSketch {
      if !route.contains(pos) {
        cleanSketch[pos] = "."
      }
    }

    return cleanSketch
  }

  func enlargeSketch(sketch: Sketch) -> Sketch {
    let translations: [Character: String] = [
      "|": ".|..|..|.",
      "F": "....F-.|.",
      "L": ".|..L-...",
      "J": ".|.-J....",
      "7": "...-7..|.",
      "-": "...---...",
      ".": ".........",
    ]
    var enlargedSketch = sketch

    for (pos, el) in sketch {
      for offsetY in 0..<3 {
        for offsetX in 0..<3 {
          let square = Square(y: pos.y * 3 + offsetY, x: pos.x * 3 + offsetX)
          enlargedSketch[square] = translations[el]!.dropFirst(offsetY * 3 + offsetX).first!
        }
      }
    }

    return enlargedSketch
  }

  func floodFill(sketch: Sketch) -> Sketch {
    var floodedSketch = sketch
    var queue: Deque = [Square(y: 0, x: 0)]

    while !queue.isEmpty {
      let current = queue.removeFirst()

      floodedSketch[current] = "x"

      for direction in [Direction.UP, .DOWN, .LEFT, .RIGHT] {
        let nextSquare = current.go(direction)
        if (floodedSketch[nextSquare] ?? " ") == "." && !queue.contains(nextSquare) {
          queue.append(nextSquare)
        }
      }
    }

    return floodedSketch
  }

  func shrinkSketch(enlargedSketch: Sketch) -> Sketch {
    let maxX = enlargedSketch.keys.map { $0.x }.max()!
    let maxY = enlargedSketch.keys.map { $0.y }.max()!

    var sketch = [Square: Character]()

    for y in 0...maxY / 3 {
      for x in 0...maxX / 3 {
        sketch[Square(y: y, x: x)] = enlargedSketch[Square(y: y * 3 + 1, x: x * 3 + 1)]!
      }
    }

    return sketch
  }

  func part1() -> Any {
    let sketch = parseSketch(input)
    let (completeSketch, start) = findAndFillStartingPipe(sketch)

    return traversePipes(sketch: completeSketch, initial: start).count / 2
  }

  func part2() -> Any {
    let flood = remoteUnconnectedPipes >>> enlargeSketch >>> floodFill >>> shrinkSketch

    return flood(parseSketch(input))
      .filter({ $0.value == "." })
      .count
  }
}
