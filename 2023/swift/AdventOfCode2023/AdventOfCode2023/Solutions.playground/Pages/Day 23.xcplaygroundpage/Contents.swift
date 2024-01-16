let input = read(file: "input")

enum HikeDirection {
    case up, down, left, right
}

struct HikePath: Hashable {
    let y: Int, x: Int
    
    init(_ y: Int, _ x: Int) {
        self.y = y
        self.x = x
    }
    
    func step(_ direction: HikeDirection) -> Self {
        switch (direction) {
        case .up: return HikePath(y - 1, x)
        case .down: return HikePath(y + 1, x)
        case .left: return HikePath(y, x - 1)
        case .right: return HikePath(y, x + 1)
        }
    }
    
    func neighbours() -> [HikePath] {
        [HikeDirection.up, .down, .left, .right].map { self.step($0) }
    }
}

typealias HikeMap = [HikePath: Character]
typealias JunctionsMap = [HikePath: [HikePath: Int]]

func parseMap(_ input: String) -> HikeMap {
    let pairs = input.lines().enumerated().flatMap { y, row in
        row.enumerated().compactMap { x, el in
            el != "#" ? (HikePath(y, x), el) : nil
        }
    }
    return Dictionary(uniqueKeysWithValues: pairs)
}

func locateStartAndEndPath(within map: HikeMap) -> (HikePath, HikePath) {
    let start = HikePath(map.keys.map { $0.y }.min()!, map.keys.map { $0.x }.min()!)
    let end = HikePath(map.keys.map { $0.y }.max()!, map.keys.map { $0.x }.max()!)
    return (start, end)
}

func compressToJunctions(within map: HikeMap, from start: HikePath, to end: HikePath, directionsForPath: (Character) -> [HikeDirection]) -> JunctionsMap {
    let junctions = Set([start, end]).union(map.keys.filter { path in path.neighbours().filter { map.keys.contains($0) }.count > 2 })
    var compressed = JunctionsMap()
    
    for junction in junctions {
        var neighbours = [HikePath: Int]()
        
        var stack = junction.neighbours().map { ($0, 1) }
        var seen = Set([junction])
        
        while !stack.isEmpty {
            let (path, steps) = stack.removeLast()
            
            if !map.keys.contains(path) || seen.contains(path) { continue }
            seen.insert(path)
            
            if junctions.contains(path) {
                neighbours[path] = steps
                continue
            }
            
            stack.append(contentsOf: directionsForPath(map[path]!).map { (path.step($0), steps + 1) })
        }
        
        compressed[junction] = neighbours
    }
    
    return compressed
}

func hike(between paths: JunctionsMap, from start: HikePath, to end: HikePath) -> Int {
    var seen = Set<HikePath>()
    var maxSteps = 0
    
    func recur(_ path: HikePath, _ steps: Int) {
        if (path == end) {
            maxSteps = max(maxSteps, steps)
            return
        }
        
        seen.insert(path)
        
        paths[path]?.forEach { (neighbour, nextSteps) in
            if (!seen.contains(neighbour)) {
                recur(neighbour, steps + nextSteps)
            }
        }
        
        seen.remove(path)
    }
    
    recur(start, 0)
    
    return maxSteps
}

func partOne() -> CustomStringConvertible {
    let map = parseMap(input)
    let (start, end) = locateStartAndEndPath(within: map)
    let paths = compressToJunctions(within: map, from: start, to: end, directionsForPath: {
        switch $0 {
        case "^":
            return [.up]
        case "v":
            return [.down]
        case "<":
            return [.left]
        case ">":
            return [.right]
        default:
            return [.up, .down, .left, .right]
        }
    })
    
    return hike(between: paths, from: start, to: end)
}

func partTwo() -> CustomStringConvertible {
    let map = parseMap(input)
    let (start, end) = locateStartAndEndPath(within: map)
    let paths = compressToJunctions(within: map, from: start, to: end, directionsForPath: { _ in
        [.up, .down, .left, .right]
    })
    
    return hike(between: paths, from: start, to: end)
}

print(partOne())
print(partTwo())
