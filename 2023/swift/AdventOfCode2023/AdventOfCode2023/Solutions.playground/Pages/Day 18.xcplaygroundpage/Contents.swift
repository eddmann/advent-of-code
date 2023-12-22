let input = read(file: "input")

enum DigDirection {
    case UP, DOWN, LEFT, RIGHT
}

struct DigStep {
    let direction: DigDirection
    let count: Int
}

// Shoelace formula + Circumference + Initial Square
func area(with steps: [DigStep]) -> Int {
    var (py, px) = (0, 0)
    var area = 0
    
    for step in steps {
        var (y, x) = (py, px)
        switch step.direction {
        case .UP: y -= step.count
        case .DOWN: y += step.count
        case .LEFT: x -= step.count
        case .RIGHT: x += step.count
        }
        
        area += (py + y) * (px - x) + step.count
        (py, px) = (y, x)
    }
    
    return abs(area / 2) + 1
}

func partOne() -> CustomStringConvertible {
    let directions = [
        "U": DigDirection.UP,
        "D": DigDirection.DOWN,
        "L": DigDirection.LEFT,
        "R": DigDirection.RIGHT
    ]
    let steps = input.lines().map { line in
        let parts = line.split(separator: " ")
        return DigStep(direction: directions[String(parts[0])]!, count: Int("\(parts[1])")!)
    }
    
    return area(with: steps)
}

func partTwo() -> CustomStringConvertible {
    let directions = [
        "0": DigDirection.RIGHT,
        "1": DigDirection.DOWN,
        "2": DigDirection.LEFT,
        "3": DigDirection.UP
    ]
    let steps = input.lines().map { line in
        let hex = Array(line.split(separator: " ").last!)
        return DigStep(direction: directions["\(hex[7])"]!, count: Int(String(hex[2...6]), radix: 16)!)
    }
    
    return area(with: steps)
}

print(partOne())
print(partTwo())
