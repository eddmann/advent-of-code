typealias Lens = (String, Int)

let input = read(file: "input")

func hash(_ step: String) -> Int {
    step.reduce(0) { acc, chr in
        ((acc + Int(chr.asciiValue!)) * 17) % 256
    }
}

func partOne() -> CustomStringConvertible {
    input.split(separator: ",").map { hash("\($0)") } .reduce(0, +)
}

func partTwo() -> CustomStringConvertible {
    var boxes = [Int: [Lens]]()
    var lenses = input.split(separator: ",")
    
    for lens in lenses {
        let label = "\(lens.prefix(while: { $0 != "=" && $0 != "-" }))"
        
        var box = boxes[hash(label), default: []]
        boxes[hash(label)] = box
        
        if lens.contains("-") {
            box.removeAll(where: { $0.0 == label })
            continue
        }
        
        let value = Int("\(lens.last!)")!
    
        if let existing = box.firstIndex(where: { $0.0 == label }) {
            box[existing] = (label, value)
        } else {
            box.append((label, value))
        }
    }
    
    return boxes
        .map { boxNo, box in
            box
                .enumerated()
                .map { slotNo, len in (box + 1) * (slotNo + 1) * len.1 }
                .reduce(0, +)
        }
        .reduce(0, +)
}

print(partOne())
print(partTwo())
