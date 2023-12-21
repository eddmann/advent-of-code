import Collections

let input = read(file: "input")

enum GridDirection {
    case UP, DOWN, LEFT, RIGHT
    
    func rotateLeft() -> GridDirection {
        switch (self) {
        case .UP: return .RIGHT
        case .DOWN: return .LEFT
        case .LEFT: return .DOWN
        case .RIGHT: return .UP
        }
    }
    
    func rotateRight() -> GridDirection {
        switch (self) {
        case .UP: return .LEFT
        case .DOWN: return .RIGHT
        case .LEFT: return .UP
        case .RIGHT: return .DOWN
        }
    }
}

struct GridPoint: Hashable {
    let y: Int, x: Int
    
    init(_ y: Int, _ x: Int) {
        self.y = y
        self.x = x
    }
    
    func step(_ direction: GridDirection) -> Self {
        switch (direction) {
        case .UP: return GridPoint(y - 1, x)
        case .DOWN: return GridPoint(y + 1, x)
        case .LEFT: return GridPoint(y, x - 1)
        case .RIGHT: return GridPoint(y, x + 1)
        }
    }
}

struct Beam: Hashable {
    let position: GridPoint
    let direction: GridDirection
    
    init(_ position: GridPoint, _ direction: GridDirection) {
        self.position = position
        self.direction = direction
    }
    
    func turn(_ direction: GridDirection) -> Self {
        Beam(position.step(direction), direction)
    }
    
    func step() -> Self {
        Beam(position.step(direction), direction)
    }
}

func parseGrid(_ input: String) -> [GridPoint: Character] {
    let entries = input.lines().enumerated().flatMap { (y, row) in
        row.enumerated().map { (x, el) in (GridPoint(y, x), el) }
    }
    return Dictionary(uniqueKeysWithValues: entries)
}

func energize(grid: [GridPoint: Character], startingAt initialBeam: Beam) -> Int {
    var queue: Deque = [initialBeam]
    var energized: Set<Beam> = []
    
    while !queue.isEmpty {
        let beam = queue.removeFirst()
        
        if grid[beam.position] == nil || energized.contains(beam) {
            continue
        }
        
        energized.insert(beam)
        
        switch grid[beam.position] {
        case ".":
            queue.append(beam.step())
        case "/":
            queue.append(beam.turn(beam.direction.rotateLeft()))
        case "\\":
            queue.append(beam.turn(beam.direction.rotateRight()))
        case "-":
            if beam.direction == .LEFT || beam.direction == .RIGHT {
                queue.append(beam.step())
            } else {
                queue.append(beam.turn(.LEFT))
                queue.append(beam.turn(.RIGHT))
            }
        case "|":
            if beam.direction == .UP || beam.direction == .DOWN {
                queue.append(beam.step())
            } else {
                queue.append(beam.turn(.UP))
                queue.append(beam.turn(.DOWN))
            }
        default:
            continue
        }
    }
    
    return Set(energized.map { $0.position }).count
}

func partOne() -> CustomStringConvertible {
    energize(grid: parseGrid(input), startingAt: Beam(GridPoint(0, 0), .RIGHT))
}

func partTwo() -> CustomStringConvertible {
    let grid = parseGrid(input)

    let maxX = grid.keys.map { $0.x }.max()!
    let maxY = grid.keys.map { $0.y }.max()!
    
    let ys = (0...maxY).flatMap { y in
        [
            energize(grid: grid, startingAt: Beam(GridPoint(y, maxX), .LEFT)),
            energize(grid: grid, startingAt: Beam(GridPoint(y, 0), .RIGHT))
        ]
    }
    let xs = (0...maxX).flatMap { x in
        [
            energize(grid: grid, startingAt: Beam(GridPoint(maxY, x), .UP)),
            energize(grid: grid, startingAt: Beam(GridPoint(0, x), .DOWN))
        ]
    }
    
    return (ys + xs).max()!
}

print(partOne())
print(partTwo())
