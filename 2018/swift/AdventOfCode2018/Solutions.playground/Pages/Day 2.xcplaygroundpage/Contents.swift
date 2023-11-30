import Foundation
import Algorithms

let ids = read(file: "input").lines()

func partOne() -> CustomStringConvertible {
    let (twos, threes) = ids.reduce((0, 0)) { acc, id in
        let frequencies = id.reduce(into: [:]) { frequencies, letter in
            frequencies[letter, default: 0] += 1
        }
        
        let (twos, threes) = acc
        return (
            twos + (frequencies.contains(where: { $0.value == 2 }) ? 1 : 0),
            threes + (frequencies.contains(where: { $0.value == 3 }) ? 1 : 0)
        )
    }
    
    return twos * threes
}

func partTwo() -> CustomStringConvertible {
    func checksum(_ comparator: (Character, Character) -> Bool, _ s1: String, _ s2: String) -> String {
        zip(s1, s2).reduce("") { acc, letters in
            return comparator(letters.0, letters.1) ? "\(acc)\(letters.0)" : acc
        }
    }
    
    for pair in ids.combinations(ofCount: 2).lazy {
        if checksum(!=, pair[0], pair[1]).count == 1 {
            return checksum(==, pair[0], pair[1])
        }
    }
    
    fatalError()
}

print(partOne())
print(partTwo())
