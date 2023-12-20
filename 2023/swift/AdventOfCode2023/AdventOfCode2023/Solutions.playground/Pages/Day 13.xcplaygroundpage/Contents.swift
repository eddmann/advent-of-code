let input = read(file: "input")

func parsePatterns(_ input: String) -> [[Character]] {
    input.split(separator: "\n\n").map { pattern in
        "\(pattern)".lines().map { Array($0) }
    }
}

func differences(pattern: [[Character]], y: Int) {
    zip(y...1, y+1...pattern.count).map { (y1, y2) in
        (1...pattern.count).filter { x in
            pattern[y1 - 1][x - 1] != pattern[y2 - 1][x - 1]
        }
    }
}

func mirror(permittedDifferences: Int, pattern: [[Character]]) {
    (1...pattern.count).first(where: { differences(pattern: pattern, y: $0) == permittedDifferences }) ?? 0
}

func summarise(permittedDistances: Int, pattern: [[Character]]) {
    mirror(permittedDifferences: permittedDistances, pattern: pattern) * 100 + mirror(permittedDifferences: permittedDistances, pattern: transpose(pattern))
}

func partOne() -> CustomStringConvertible {
    parsePatterns(input)
        .map({ summarise(permittedDistances: 0, pattern: $0 )})
        .reduce(0, +)
}

func partTwo() -> CustomStringConvertible {
    parsePatterns(input)
        .map({ summarise(permittedDistances: 1, pattern: $0 )})
        .reduce(0, +)
}

print(partOne())
print(partTwo())
