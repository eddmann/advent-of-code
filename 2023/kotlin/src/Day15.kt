private typealias Lens = Pair<String, Int>

private fun hash(step: String) =
    step.fold(0) { acc, chr -> ((acc + chr.code) * 17) % 256 }

private fun part1(input: String) =
    input.split(",").sumOf(::hash)

private fun part2(input: String): Int {
    val boxes = mutableMapOf<Int, MutableList<Lens>>().withDefault { mutableListOf() }
    val lenses = input.split(",")

    for (lens in lenses) {
        val label = lens.takeWhile { it != '=' && it != '-' }

        val box = boxes.getValue(hash(label))
        boxes[hash(label)] = box

        if (lens.endsWith("-")) {
            box.removeAll { it.first == label }
            continue
        }

        val value = lens.takeLast(1).toInt()
        val existing = box.indexOfFirst { it.first == label }

        if (existing == -1) {
            box.add(label to value)
        } else {
            box[existing] = label to value
        }
    }

    return boxes.toList().sumOf { (boxNo, box) ->
        box.mapIndexed { slotNo , (_, value) -> (boxNo + 1) * (slotNo + 1) * value }.sum()
    }
}

fun main() {
    val input = readInput("Day15")
    part1(input).println()
    part2(input).println()
}
