typealias Component = String
typealias Subgroup = Set<Component>
typealias Subgroups = Set<Subgroup>

extension Subgroups {
  func find(component: Component) -> Subgroup {
    return first(where: { $0.contains(component) })!
  }

  mutating func merge(_ a: Subgroup, _ b: Subgroup) {
    if a == b { return }
    remove(a)
    remove(b)
    insert(a.union(b))
  }
}

protocol PairConvertible {
  associatedtype A
  associatedtype B
  init(_ pair: (A, B))
}

struct PairStruct<A, B>: Hashable, PairConvertible where A: Hashable, B: Hashable {
  let a: A
  let b: B

  init(_ pair: (A, B)) {
    self.a = pair.0
    self.b = pair.1
  }
}

struct Day25: AdventDay {
  var input: String

  // https://en.wikipedia.org/wiki/Karger%27s_algorithm
  func part1() -> Any {
    let lines = input.lines().map {
      $0.split(whereSeparator: { $0 == " " || $0 == ":" })
        .map { "\($0)".trimmingCharacters(in: .whitespaces) }
        .filter { !$0.isEmpty }
    }

    let components = Set(lines.joined())
    let connections = Set(
      lines.flatMap { line in
        line.dropFirst(1).map { PairStruct((line[0], "\($0)")) }
      })

    while true {
      var subgroups = Set(components.map { Set([$0]) })
      var randomConnection = connections.shuffled().makeIterator()

      while subgroups.count > 2 {
        let components = randomConnection.next()!

        let subgroup1 = subgroups.find(component: components.a)
        let subgroup2 = subgroups.find(component: components.b)

        subgroups.merge(subgroup1, subgroup2)
      }

      let wires =
        connections
        .filter { components in
          subgroups.find(component: components.a) != subgroups.find(component: components.b)
        }
        .count
      if wires > 3 { continue }

      return subgroups.map { $0.count }.reduce(1, *)
    }
  }
}
