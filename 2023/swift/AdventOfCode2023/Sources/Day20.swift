struct Day20: AdventDay {
  var input: String

  struct Pulse: CustomStringConvertible {
    let from: String, to: String, isHigh: Bool

    var description: String {
      "\(from) -\(isHigh)-> \(to)"
    }
  }

  class Module {
    let id: String, incoming: [String], outgoing: [String]

    init(id: String, incoming: [String], outgoing: [String]) {
      self.id = id
      self.incoming = incoming
      self.outgoing = outgoing
    }

    func handle(pulse: Pulse) -> [Pulse] {
      []
    }

    static func build(from input: String) -> (Broadcast, [String: Module]) {
      let mappings = input.lines().map { line in
        let parts = line.components(separatedBy: " -> ")
        let outgoing = parts[1].components(separatedBy: ", ")
        return (parts[0], outgoing)
      }

      let broadcaster = Broadcast(outgoing: mappings.first(where: { $0.0 == "broadcaster" })!.1)

      let modules = mappings.filter { $0.0 != "broadcaster" }.map { mapping in
        let (typeAndId, outgoing) = mapping
        let type = typeAndId.first!
        let id = String(typeAndId.dropFirst(1))

        let incoming = mappings.compactMap { mapping in
          let (typeAndId, outgoing) = mapping
          return outgoing.contains(id) ? String(typeAndId.dropFirst(1)) : nil
        }

        let module =
          type == "%"
          ? FlipFlop(id: id, incoming: incoming, outgoing: outgoing)
          : Conjunction(id: id, incoming: incoming, outgoing: outgoing)

        return (id, module)
      }

      return (broadcaster, Dictionary(uniqueKeysWithValues: modules))
    }
  }

  class FlipFlop: Module {
    private var wasPreviousPulseHigh = false

    override func handle(pulse: Pulse) -> [Pulse] {
      if pulse.isHigh { return [] }
      wasPreviousPulseHigh = !wasPreviousPulseHigh
      return outgoing.map { Pulse(from: id, to: $0, isHigh: wasPreviousPulseHigh) }
    }
  }

  class Conjunction: Module {
    private var history: [String: Bool]

    override init(id: String, incoming: [String], outgoing: [String]) {
      history = Dictionary(uniqueKeysWithValues: incoming.map { ($0, false) })
      super.init(id: id, incoming: incoming, outgoing: outgoing)
    }

    override func handle(pulse: Pulse) -> [Pulse] {
      history[pulse.from] = pulse.isHigh
      return outgoing.map { Pulse(from: id, to: $0, isHigh: !history.values.allSatisfy { $0 }) }
    }
  }

  struct Broadcast {
    let outgoing: [String]

    func press() -> [Pulse] {
      outgoing.map { Pulse(from: "broadcaster", to: $0, isHigh: false) }
    }
  }

  func part1() -> Any {
    let (broadcaster, modules) = Module.build(from: input)

    var lowPulses = 0
    var highPulses = 0
    var queue = [Pulse]()

    for _ in 0..<1000 {
      lowPulses += 1
      queue.append(contentsOf: broadcaster.press())

      while !queue.isEmpty {
        let pulse = queue.removeFirst()
        if pulse.isHigh { highPulses += 1 } else { lowPulses += 1 }
        if let module = modules[pulse.to] {
          queue.append(contentsOf: module.handle(pulse: pulse))
        }
      }
    }

    return lowPulses * highPulses
  }

  func part2() -> Any {
    let (broadcaster, modules) = Module.build(from: input)

    var presses = 0
    var queue = [Pulse]()

    let lastModuleId = modules.values.first(where: { $0.outgoing.contains("rx") })!.id
    let connectionsToLastModule = modules.values.compactMap {
      $0.outgoing.contains(lastModuleId) ? $0.id : nil
    }
    var pressesToHighPulse = Dictionary(
      uniqueKeysWithValues: connectionsToLastModule.map { ($0, 0) })

    while pressesToHighPulse.contains(where: { $0.value == 0 }) {
      presses += 1
      queue.append(contentsOf: broadcaster.press())

      while !queue.isEmpty {
        let pulse = queue.removeFirst()
        if pulse.to == lastModuleId && pulse.isHigh { pressesToHighPulse[pulse.from] = presses }
        if let module = modules[pulse.to] {
          queue.append(contentsOf: module.handle(pulse: pulse))
        }
      }
    }

    return pressesToHighPulse.values.reduce(1, *)
  }
}
