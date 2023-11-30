import Foundation
import Algorithms

let changes = read(file: "input").ints()

func partOne() -> CustomStringConvertible {
    changes.reduce(0, +)
}

func partTwo() -> CustomStringConvertible {
    var seen: Set = [0]
    var frequency = 0

    for change in changes.cycled() {
        frequency += change
        
        if seen.contains(frequency) {
            return frequency
        }
        
        seen.insert(frequency)
    }
    
    fatalError("")
}

print(partOne())
print(partTwo())
