import Algorithms

let input = read(file: "input")

func parseReport(_ input: String) -> [[Int]] {
    input.lines().map { $0.ints() }
}

func extrapolate(_ history: [Int]) -> Int {
    if history.allSatisfy({ $0 == 0 }) {
        return 0
    }
    
    let diffs = history.windows(ofCount: 2).map { pair in pair.last! - pair.first! }
    
    return history.last! + extrapolate(diffs)
}

func partOne() -> CustomStringConvertible {
    parseReport(input)
        .map(extrapolate)
        .reduce(0, +)
}

func partTwo() -> CustomStringConvertible {
    parseReport(input)
        .map { $0.reversed() }
        .map(extrapolate)
        .reduce(0, +)
}

print(partOne())
print(partTwo())
