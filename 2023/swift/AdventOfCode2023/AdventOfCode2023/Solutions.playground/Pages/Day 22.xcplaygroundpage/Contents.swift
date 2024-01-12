let input = read(file: "input")

struct Point3D: Hashable {
    let y: Int, x: Int, z: Int
    
    static func from(_ input: String) -> Self {
        let coordinates = input.ints()
        return Point3D(y: coordinates[1], x: coordinates[0], z: coordinates[2])
    }
}

struct Brick {
    let start: Point3D, end: Point3D
    
    var volume: Set<Point3D> {
        Set(
            (start.y...end.y).flatMap { y in
                (start.x...end.x).flatMap { x in
                    (start.z...end.z).map { z in
                        Point3D(y: y, x: x, z: z)
                    }
                }
            }
        )
    }
    
    private var top: Int {
        max(start.z, end.z)
    }
    
    var bottom: Int {
        min(start.z, end.z)
    }
    
    func drop() -> Self {
        Brick(
            start: Point3D(y: start.y, x: start.x, z: start.z - 1),
            end: Point3D(y: end.y, x: end.x, z: end.z - 1)
        )
    }
    
    func isDirectlyBelow(brick: Brick) -> Bool {
        top + 1 == brick.bottom
    }
    
    func isSupported(by brick: Brick) -> Bool {
        brick.isDirectlyBelow(brick: self) && (start.x...end.x).overlaps(brick.start.x...brick.end.x) && (start.y...end.y).overlaps(brick.start.y...end.y)
    }
    
    static func from(_ input: String) -> Self {
        let startAndEnd = input.components(separatedBy: "~")
        return Brick(start: Point3D.from(startAndEnd[0]), end: Point3D.from(startAndEnd[1]))
    }
}

func parseBricks(_ input: String) -> [Brick] {
    input.lines().map { Brick.from($0) }
}

func drop(bricks: [Brick]) -> [Brick] {
    var settled = [Brick]()
    
    for brick in bricks.sorted(by: { $0.bottom < $1.bottom }) {
        var dropping = brick
        
        while true {
            let dropped = dropping.drop()
            if dropped.bottom > 0 && settled.allSatisfy({ dropped.volume.intersection($0.volume).isEmpty }) {
                dropping = dropped
                continue
            }
            
            break
        }
        
        settled.append(dropping)
    }
    
    return settled
}

func canDrop(from volume: Set<Point3D>, brick: Brick) -> Bool {
    volume.subtracting(brick.volume).intersection(brick.drop().volume).isEmpty
}

func canRemove(from bricks: [Brick], at index: Int) -> Bool {
    let brick = bricks[index]
    let volumeWithoutSubjectBrick = Set(bricks.flatMap { $0.volume }).subtracting(brick.volume)
    
    return !bricks
        .dropFirst(index + 1)
        .contains(where: { brick.isDirectlyBelow(brick: $0) && canDrop(from: volumeWithoutSubjectBrick, brick: $0) })
}

func chainReaction(for bricks: [Brick], at index: Int) -> Int {
    let brick = bricks[index]
    var removed = [brick]
    
    var volumeOfRemainingBricks = Set(bricks.flatMap { $0.volume })
    volumeOfRemainingBricks.subtract(brick.volume)
    
    var chain = 0
    for otherBrick in bricks.dropFirst(index + 1) {
        let wasSupported = removed.contains(where: { otherBrick.isSupported(by: $0) })
        if wasSupported && canDrop(from: volumeOfRemainingBricks, brick: otherBrick) {
            chain += 1
            volumeOfRemainingBricks.subtract(otherBrick.volume)
            removed.append(otherBrick)
        }
    }
    
    return chain
}

func partOne() -> CustomStringConvertible {
    let bricks = drop(bricks: parseBricks(input))
    return (0..<bricks.count)
        .filter { canRemove(from: bricks, at: $0) }
        .count
}

func partTwo() -> CustomStringConvertible {
    let bricks = drop(bricks: parseBricks(input))
    return (0..<bricks.count)
        .map { chainReaction(for: bricks, at: $0) }
        .reduce(0, +)
}

print(partOne())
print(partTwo())
