import Foundation

let input = read(file: "input")

struct Point: Hashable {
    let y: Int, x: Int
    
    init(_ y: Int, _ x: Int) {
        self.y = y
        self.x = x
    }
}

struct CandidatePart {
    let number: Int
    let outline: Set<Point>
}

func parseCandidateParts(_ input: String) -> [CandidatePart] {
    var parts = [CandidatePart]()
    
    for (y, row) in input.lines().enumerated() {
        var number = ""
        var outline: Set<Point> = []
        
        for (x, value) in "\(row).".enumerated() {
            if value.isNumber {
                if number.isEmpty {
                    outline.insert(Point(y - 1, x - 1))
                    outline.insert(Point(y, x - 1))
                    outline.insert(Point(y +  1, x - 1))
                }
                number.append(value)
                outline.insert(Point(y - 1, x))
                outline.insert(Point(y + 1, x))
            } else if !number.isEmpty {
                outline.insert(Point(y - 1, x))
                outline.insert(Point(y, x))
                outline.insert(Point(y + 1, x))
                parts.append(CandidatePart(number: Int(number)!, outline: outline))
                number = ""
                outline = []
            }
        }
    }
    
    return parts
}

func parseSymbols(_ input: String, _ predicate: (Character) -> Bool) -> Set<Point> {
    let points: [Point] = input.lines().enumerated().flatMap { (y, row) in
        row.enumerated().reduce([Point]()) { points, el in
            let (x, value) = el
            return predicate(value) ? points + [Point(y, x)] : points
        }
    }
    return Set(points)
}

func partOne() -> CustomStringConvertible {
    let candidates = parseCandidateParts(input)
    let symbols = parseSymbols(input) { !$0.isNumber && $0 != "." }
    
    return candidates
        .filter { !$0.outline.intersection(symbols).isEmpty }
        .map { $0.number }
        .reduce(0, +)
}

func partTwo() -> CustomStringConvertible {
    let candidates = parseCandidateParts(input)
    let gears = parseSymbols(input) { $0 == "*" }
    
    return gears
        .map { gear in
            let parts = candidates.filter { $0.outline.contains(gear) }
            return parts.count == 2 ? parts[0].number * parts[1].number : 0
        }
        .reduce(0, +)
}

print(partOne())
print(partTwo())
