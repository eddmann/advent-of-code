struct Day24: AdventDay {
  var input: String

  struct Point3D {
    let x: Double, y: Double, z: Double

    static func from(_ input: String) -> Self {
      let coordinates = input.ints()
      return Point3D(
        x: Double(coordinates[0]), y: Double(coordinates[1]), z: Double(coordinates[2]))
    }
  }

  struct Intersection {
    let x: Double, y: Double
  }

  struct Hailstone {
    let position: Point3D
    let velocity: Point3D

    var slope: Double {
      velocity.y / velocity.x
    }

    func intersection(with other: Hailstone) -> Intersection? {
      if velocity.x == 0 || other.velocity.x == 0 || slope == other.slope {
        return Optional.none
      }

      let x =
        ((other.position.y - other.slope * other.position.x) - (position.y - slope * position.x))
        / (slope - other.slope)
      let y = slope * (x - position.x) + position.y

      let t1 = (x - position.x) / velocity.x
      let t2 = (x - other.position.x) / other.velocity.x

      if t1 < 0 || t2 < 0 {
        return Optional.none
      }

      return Intersection(x: x, y: y)
    }

    static func from(_ input: String) -> Self {
      let split = input.split(separator: "@", maxSplits: 1)
      return Self(position: Point3D.from("\(split[0])"), velocity: Point3D.from("\(split[1])"))
    }
  }

  func part1() -> Any {
    let hailstones = input.lines().map { Hailstone.from($0) }
    let range = 200000000000000.0...400000000000000.0

    return
      hailstones
      .combinations(ofCount: 2)
      .compactMap { hailstones in hailstones[0].intersection(with: hailstones[1]) }
      .filter { intersection in range.contains(intersection.x) && range.contains(intersection.y) }
      .count
  }

  // Thank you https://www.reddit.com/r/adventofcode/comments/18pnycy/comment/kepl4p8/
  func part2() -> Any {
    // let hailstones = input.lines().map { Hailstone.from($0) }

    return 0
  }
}
