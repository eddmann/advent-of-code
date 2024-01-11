let input = read(file: "input")

enum StepDirection {
    case up, down, left, right
}

struct StepPoint: Hashable {
    let y: Int, x: Int
    
    init(_ y: Int, _ x: Int) {
        self.y = y
        self.x = x
    }
    
    func step(_ direction: StepDirection) -> Self {
        switch (direction) {
        case .up: return StepPoint(y - 1, x)
        case .down: return StepPoint(y + 1, x)
        case .left: return StepPoint(y, x - 1)
        case .right: return StepPoint(y, x + 1)
        }
    }
    
    func neighbours() -> [StepPoint] {
        [StepDirection.up, .down, .left, .right].map { self.step($0) }
    }
}

struct Garden {
    let size: Int
    let plots: Set<StepPoint>
    let start: StepPoint
    
    func totalPlotsLandedOnAfter(steps: Int) -> Int {
        var landedOn = Set([start])
        
        for _ in 1...steps {
            landedOn = Set(landedOn.flatMap { plot in
                plot.neighbours().compactMap { nextPlot in
                    plots.contains(StepPoint(nextPlot.y % size, nextPlot.x % size)) ? nextPlot : nil
                }
            })
        }
        
        return landedOn.count
    }
    
    static func from(_ input: String) -> Self {
        var start = StepPoint(0, 0)
        let plots = Set(input.lines().enumerated().flatMap { y, row in
            row.enumerated().compactMap { x, el in
                if el == "S" { start = StepPoint(y, x) }
                return el != "#" ? StepPoint(y, x) : nil
            }
        })
        
        return Garden(size: input.lines().count, plots: plots, start: start)
    }
}

func partOne() -> CustomStringConvertible {
    Garden.from(input).totalPlotsLandedOnAfter(steps: 64)
}

func partTwo() -> CustomStringConvertible {
    val garden = Garden.from(input)
    
    let target = (26_501_365 - 65) / 131
    let ys = [
        garden.totalPlotsLandedOnAfterSteps(65),
        garden.totalPlotsLandedOnAfterSteps(65 + 131),
        garden.totalPlotsLandedOnAfterSteps(65 + 2 * 131)
    ]
    
    return ys
        .enumerated()
        .map { idx, y in
            (0...ys.count).filter { $0 != idx }.reduce { acc, x in
                acc * (target - x) / (idx - x)
            }
        }
        .reduce(0, +)
}

print(partOne())
print(partTwo())
