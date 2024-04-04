import Foundation
import RegexBuilder

extension String {
  public func lines() -> [String] {
    self.trimmingCharacters(in: .whitespacesAndNewlines).components(separatedBy: .newlines)
  }

  public func ints() -> [Int] {
    let regex = Regex {
      TryCapture {
        ZeroOrMore("-")
        OneOrMore(.digit)
      } transform: {
        Int($0)
      }
    }

    return self.matches(of: regex).map { $0.1 }
  }
}

extension Array {
  public func chunked(into size: Int) -> [[Element]] {
    return stride(from: 0, to: count, by: size).map {
      Array(self[$0..<Swift.min($0 + size, count)])
    }
  }
}

public func transpose<T>(_ matrix: [[T]]) -> [[T]] {
  guard !matrix.isEmpty else {
    return []
  }

  var ret = Array(repeating: [T](), count: matrix[0].count)

  for row in matrix {
    for j in 0..<row.count {
      ret[j].append(row[j])
    }
  }

  return ret
}

extension Sequence where Element: AdditiveArithmetic {
  func sum() -> Element {
    return reduce(.zero, +)
  }
}

extension Sequence {
  func sum<T: AdditiveArithmetic>(_ transform: (Element) -> T) -> T {
    return map(transform).sum()
  }
}

extension Sequence {
  func parallelMap<T>(
    _ mapper: @escaping (Element) async -> T
  ) async -> [T] {
    let tasks = map { element in
      Task { await mapper(element) }
    }

    var values = [T]()

    for task in tasks {
      values.append(await task.value)
    }

    return values
  }
}
