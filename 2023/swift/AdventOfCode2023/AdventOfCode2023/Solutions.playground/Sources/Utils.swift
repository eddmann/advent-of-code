import Foundation
import RegexBuilder

public func read(file named: String) -> String {
    guard let fileUrl = Bundle.main.url(forResource: named, withExtension: "txt") else {
        return ""
    }
    
    guard let content = try? String(contentsOf: fileUrl, encoding: .utf8) else {
        return ""
    }
    
    return content.trimmingCharacters(in: .whitespacesAndNewlines)
}

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
            Array(self[$0 ..< Swift.min($0 + size, count)])
        }
    }
}
