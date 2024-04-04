@_exported import Algorithms
@_exported import Collections
import Foundation

protocol AdventDay {
  associatedtype Answer = Int

  /// The day of the Advent of Code challenge.
  ///
  /// You can implement this property, or, if your type is named with the
  /// day number as its suffix (like `Day01`), it is derived automatically.
  static var day: Int { get }

  /// An initializer that uses the provided test input.
  init(input: String)

  /// Computes and returns the answer for part one.
  func part1() async throws -> Answer

  /// Computes and returns the answer for part two.
  func part2() async throws -> Answer
}

struct PartUnimplemented: Error {
  let day: Int
  let part: Int
}

extension AdventDay {
  // Find the challenge day from the type name.
  static var day: Int {
    let typeName = String(reflecting: Self.self)
    guard let i = typeName.lastIndex(where: { !$0.isNumber }),
      let day = Int(typeName[i...].dropFirst())
    else {
      fatalError(
        """
        Day number not found in type name: \
        implement the static `day` property \
        or use the day number as your type's suffix (like `Day3`).")
        """)
    }
    return day
  }

  var day: Int {
    Self.day
  }

  // Default implementation of `part2`, so there aren't interruptions before
  // working on `part1()`.
  func part2() throws -> Answer {
    throw PartUnimplemented(day: day, part: 2)
  }

  /// An initializer that loads the test input from the corresponding input file.
  init() {
    self.init(input: Self.loadInput(challengeDay: Self.day))
  }

  static func loadInput(challengeDay: Int) -> String {
    let dayString = String(format: "%02d", challengeDay)
    let filename = "Day\(dayString)"
    let url = Bundle.module.url(
      forResource: filename,
      withExtension: "txt",
      subdirectory: "Input")

    guard let url,
      let input = try? String(contentsOf: url, encoding: .utf8)
    else {
      fatalError("Couldn't find file '\(filename).txt' in the 'Input' directory.")
    }

    return input.trimmingCharacters(in: .whitespacesAndNewlines)
  }
}
