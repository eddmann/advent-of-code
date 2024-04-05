import SwiftZ3

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
    let hailstones = input.lines().map { Hailstone.from($0) }

    let ctx = Z3Context()
    let solver = ctx.makeSolver()

    let x: Z3Real = ctx.makeConstant(name: "x")
    let y: Z3Real = ctx.makeConstant(name: "y")
    let z: Z3Real = ctx.makeConstant(name: "z")
    let vx: Z3Real = ctx.makeConstant(name: "vx")
    let vy: Z3Real = ctx.makeConstant(name: "vy")
    let vz: Z3Real = ctx.makeConstant(name: "vz")

    for (idx, hailstone) in hailstones[0...2].enumerated() {
      let t: Z3Real = ctx.makeConstant(name: "t\(idx)")
      let h_px = ctx.makeIntToReal(ctx.makeInteger64(Int64(hailstone.position.x)))
      let h_py = ctx.makeIntToReal(ctx.makeInteger64(Int64(hailstone.position.y)))
      let h_pz = ctx.makeIntToReal(ctx.makeInteger64(Int64(hailstone.position.z)))
      let h_vx = ctx.makeIntToReal(ctx.makeInteger64(Int64(hailstone.velocity.x)))
      let h_vy = ctx.makeIntToReal(ctx.makeInteger64(Int64(hailstone.velocity.y)))
      let h_vz = ctx.makeIntToReal(ctx.makeInteger64(Int64(hailstone.velocity.z)))

      solver.assert((x + vx * t) == (h_px + h_vx * t))
      solver.assert((y + vy * t) == (h_py + h_vy * t))
      solver.assert((z + vz * t) == (h_pz + h_vz * t))
    }

    if solver.check() != .satisfiable {
      fatalError("Failed to solve equation")
    }

    return solver.getModel()!.eval(x + (y + z))!.numeralDouble
  }
}
