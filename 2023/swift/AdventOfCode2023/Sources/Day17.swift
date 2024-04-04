struct Day17: AdventDay {
  var input: String

  enum CrucibleDirection {
    case UP, DOWN, LEFT, RIGHT

    func rotateLeft() -> CrucibleDirection {
      switch self {
      case .UP: return .RIGHT
      case .DOWN: return .LEFT
      case .LEFT: return .DOWN
      case .RIGHT: return .UP
      }
    }

    func rotateRight() -> CrucibleDirection {
      switch self {
      case .UP: return .LEFT
      case .DOWN: return .RIGHT
      case .LEFT: return .UP
      case .RIGHT: return .DOWN
      }
    }
  }

  struct CruciblePoint: Hashable {
    let y: Int, x: Int

    init(_ y: Int, _ x: Int) {
      self.y = y
      self.x = x
    }

    func step(_ direction: CrucibleDirection) -> Self {
      switch direction {
      case .UP: return CruciblePoint(y - 1, x)
      case .DOWN: return CruciblePoint(y + 1, x)
      case .LEFT: return CruciblePoint(y, x - 1)
      case .RIGHT: return CruciblePoint(y, x + 1)
      }
    }
  }

  struct Crucible: Comparable {
    let position: CruciblePoint
    let direction: CrucibleDirection
    let forwards: Int
    let heatLoss: Int

    func state() -> CrucibleState {
      CrucibleState(position: position, direction: direction, forwards: forwards)
    }

    static func < (lhs: Crucible, rhs: Crucible) -> Bool {
      lhs.heatLoss < rhs.heatLoss
    }

    static func == (lhs: Crucible, rhs: Crucible) -> Bool {
      lhs.heatLoss == lhs.heatLoss
    }
  }

  struct CrucibleState: Hashable {
    let position: CruciblePoint
    let direction: CrucibleDirection
    let forwards: Int
  }

  func parseCity(_ input: String) -> [CruciblePoint: Int] {
    let entries = input.lines().enumerated().flatMap { (y, row) in
      row.enumerated().map { (x, el) in (CruciblePoint(y, x), Int("\(el)")!) }
    }
    return Dictionary(uniqueKeysWithValues: entries)
  }

  func simuluate(city: [CruciblePoint: Int], forwardsLimit: Int, rotateLimit: Int) -> Int {
    let goal = CruciblePoint(city.keys.map { $0.x }.max()!, city.keys.map { $0.y }.max()!)

    let queue = PriorityQueue<Crucible>()
    queue.add(Crucible(position: CruciblePoint(0, 0), direction: .RIGHT, forwards: 0, heatLoss: 0))
    queue.add(Crucible(position: CruciblePoint(0, 0), direction: .DOWN, forwards: 0, heatLoss: 0))
    var seen = Set<CrucibleState>()

    while let crucible = queue.dequeue() {
      if crucible.position == goal && crucible.forwards >= rotateLimit {
        return crucible.heatLoss
      }

      if seen.contains(crucible.state()) {
        continue
      }

      seen.insert(crucible.state())

      let forwards = crucible.position.step(crucible.direction)
      if city[forwards] != nil && crucible.forwards < forwardsLimit {
        queue.add(
          Crucible(
            position: forwards, direction: crucible.direction, forwards: crucible.forwards + 1,
            heatLoss: crucible.heatLoss + city[forwards]!))
      }

      if crucible.forwards < rotateLimit {
        continue
      }

      let left = crucible.position.step(crucible.direction.rotateLeft())
      if city[left] != nil {
        queue.add(
          Crucible(
            position: left, direction: crucible.direction.rotateLeft(), forwards: 1,
            heatLoss: crucible.heatLoss + city[left]!))
      }

      let right = crucible.position.step(crucible.direction.rotateRight())
      if city[right] != nil {
        queue.add(
          Crucible(
            position: right, direction: crucible.direction.rotateRight(), forwards: 1,
            heatLoss: crucible.heatLoss + city[right]!))
      }
    }

    return 0
  }

  func part1() -> Any {
    simuluate(city: parseCity(input), forwardsLimit: 3, rotateLimit: 0)
  }

  func part2() -> Any {
    simuluate(city: parseCity(input), forwardsLimit: 10, rotateLimit: 4)
  }
}
