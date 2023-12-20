let input = read(file: "input")

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
    }.reduce(0, +)
}

func cycle(_ dish: Dish) -> Dish {
    let cycled = (1...4).reduce(transpose(dish)) { dish, _ in
        transpose(tilt(dish).map { $0.reversed() })
    }
    return transpose(cycled)
}

func partOne() -> CustomStringConvertible {
    let dish = parseDish(input)
    let tiltedDish = transpose(tilt(transpose(dish)))
    return totalLoad(tiltedDish)
}

func partTwo() -> CustomStringConvertible {
    let initialDish = parseDish(input)
    
    var seen = [Dish: Int]()
    var history = [Dish]()
    var dish = initialDish
    var idx = 0
    
    while (true) {
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

print(partOne())
print(partTwo())
