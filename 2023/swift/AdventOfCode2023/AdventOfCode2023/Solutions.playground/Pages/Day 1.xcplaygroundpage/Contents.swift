let input = read(file: "input")

func calibrate(_ values: [String]) -> Int {
    values.map { value in
        let digits = value.matches(of: /\d/).map { $0.output }
        return Int("\(digits.first!)\(digits.last!)")!
    }.reduce(0, +)
}

func partOne() -> CustomStringConvertible {
    calibrate(input.lines())
}

func partTwo() -> CustomStringConvertible {
    let translations = [
        "one": "o1e",
        "two": "t2o",
        "three": "t3e",
        "four": "4",
        "five": "5e",
        "six": "6",
        "seven": "7n",
        "eight": "e8t",
        "nine": "n9e"
    ]
    
    let values = input.lines().map { value in
        translations.reduce(value) { translated, entry in
            translated.replacingOccurrences(of: entry.key, with: entry.value)
        }
    }
    
    return calibrate(values)
}

print(partOne())
print(partTwo())
