struct Day15: AdventDay {
  var input: String

  typealias Lens = (String, Int)

  func hash(_ step: String) -> Int {
    step.reduce(0) { acc, chr in
      ((acc + Int(chr.asciiValue!)) * 17) % 256
    }
  }

  func part1() -> Any {
    input.split(separator: ",").map { hash("\($0)") }.sum()
  }

  func part2() -> Any {
    var boxes = [Int: [Lens]]()
    let lenses = input.split(separator: ",")

    for lens in lenses {
      let label = "\(lens.prefix(while: { $0 != "=" && $0 != "-" }))"

      var box = boxes[hash(label), default: []]

      if lens.contains("-") {
        box.removeAll(where: { $0.0 == label })
        boxes[hash(label)] = box
        continue
      }

      let value = Int("\(lens.last!)")!

      if let existing = box.firstIndex(where: { $0.0 == label }) {
        box[existing] = (label, value)
      } else {
        box.append((label, value))
      }

      boxes[hash(label)] = box
    }

    return
      boxes
      .sum { boxNo, box in
        box
          .enumerated()
          .map { slotNo, lens in (boxNo + 1) * (slotNo + 1) * lens.1 }
          .sum()
      }
  }
}
