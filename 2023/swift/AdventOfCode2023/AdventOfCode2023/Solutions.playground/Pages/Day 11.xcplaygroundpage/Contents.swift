import Algorithms

let input = read(file: "input")

struct Point {
    let y: Int, x: Int
}

func manhattanDistance(_ a: Point, _ b: Point) -> Int {
    abs(a.y - b.y) + abs(a.x - b.x)
}

func parseGalaxies(_ input: String) -> [Point] {
    input.lines().enumerated().flatMap { (y, row) in
        row.enumerated().reduce([Point]()) { acc, item in
            let (x, el) = item
            return el == "#" ? acc + [Point(y: y, x: x)] : acc
        }
    }
}

func determineExtraSpace(_ input: String) -> ([Int], [Int]) {
    let lines = input.lines()
    
    let extraRows: [Int] = lines.enumerated().reduce([Int]()) { acc, item in
        let (coord, line) = item
        return line.allSatisfy({ $0 == "." }) ? acc + [coord] : acc
    }

    let extraCols: [Int] = (0..<lines[0].count).reduce([Int]()) { acc, coord in
        (lines.map({ $0.dropFirst(coord).first! }).allSatisfy({ $0 == "." })) ? acc + [coord] : acc
    }
    
    return (extraRows, extraCols)
}

func partOne() -> CustomStringConvertible {
    let galaxies = parseGalaxies(input)
    let (extraRows, extraCols) = determineExtraSpace(input)
    
    return galaxies
        .combinations(ofCount: 2)
        .map { pair in
            let totalExtraRows = extraRows.filter { y in (min(pair[0].y, pair[1].y)...max(pair[0].y, pair[1].y)).contains(y) }.count
            let totalExtraCols = extraCols.filter { x in (min(pair[0].x, pair[1].x)...max(pair[0].x, pair[1].x)).contains(x) }.count
            return manhattanDistance(pair[0], pair[1]) + totalExtraRows + totalExtraCols
        }
        .reduce(0, +)
}

func partTwo() -> CustomStringConvertible {
    let galaxies = parseGalaxies(input)
    let (extraRows, extraCols) = determineExtraSpace(input)
    
    return galaxies
        .combinations(ofCount: 2)
        .map { pair in
            let totalExtraRows = extraRows.filter { y in (min(pair[0].y, pair[1].y)...max(pair[0].y, pair[1].y)).contains(y) }.count * 999_999
            let totalExtraCols = extraCols.filter { x in (min(pair[0].x, pair[1].x)...max(pair[0].x, pair[1].x)).contains(x) }.count * 999_999
            return manhattanDistance(pair[0], pair[1]) + totalExtraRows + totalExtraCols
        }
        .reduce(0, +)
}

print(partOne())
print(partTwo())
