struct Day01: AdventDay {
  var input: String

  func calibrate(_ values: [String]) -> Int {
    values.map { value in
      let digits = value.matches(of: /\d/).map { $0.output }
      return Int("\(digits.first!)\(digits.last!)")!
    }.sum()
  }

  func part1() -> Any {
    calibrate(input.lines())
  }

  func part2() -> Any {
    let translations = [
      "one": "o1e",
      "two": "t2o",
      "three": "t3e",
      "four": "4",
      "five": "5e",
      "six": "6",
      "seven": "7n",
      "eight": "e8t",
      "nine": "n9e",
    ]

    let values = input.lines().map { value in
      translations.reduce(value) { translated, entry in
        translated.replacingOccurrences(of: entry.key, with: entry.value)
      }
    }

    return calibrate(values)
  }
}
