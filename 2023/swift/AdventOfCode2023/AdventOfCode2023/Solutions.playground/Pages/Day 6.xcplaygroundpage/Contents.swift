let input = read(file: "input")

func countRaceWins(recordTime: Int, recordDistance: Int) -> Int {
    (0...recordTime)
        .filter({ distance in
            distance * (recordTime - distance) > recordDistance
        })
        .count
}

func partOne() -> CustomStringConvertible {
    let timesAndDistances = input.lines().map { $0.ints() }
    let races = zip(timesAndDistances[0], timesAndDistances[1])
    
    return races
        .map { timeAndDistance in
            let (time, distance) = timeAndDistance
            return countRaceWins(recordTime: time, recordDistance: distance)
        }
        .reduce(1, *)
}

func partTwo() -> CustomStringConvertible {
    let timeAndDistance = input.lines().map { $0.replacingOccurrences(of: " ", with: "").ints()[0] }
    
    return countRaceWins(recordTime: timeAndDistance[0], recordDistance: timeAndDistance[1])
}

print(partOne())
print(partTwo())
