typealias Component = String
typealias Subgroup = MutableSet<Component>
typealias Subgroups = MutableSet<Subgroup>

fun Subgroups.find(c: Component) = first { c in it }
fun Subgroups.merge(a: Subgroup, b: Subgroup) {
    if (a === b) return;
    a.addAll(b)
    removeIf { it === b }
}

// https://en.wikipedia.org/wiki/Karger%27s_algorithm
private fun part1(input: String): Int {
    val lines = input.lines().map {
        it.split(':', ' ').filterNot(String::isBlank)
    }

    val components = lines.flatten().toSet()
    val connections = buildSet {
        lines.forEach { line ->
            addAll(line.drop(1).map { line.first() to it })
        }
    }

    while (true) {
        val subgroups = components.map { mutableSetOf(it) }.toMutableSet()
        val randomConnection = connections.shuffled().iterator()

        while (subgroups.size > 2) {
            val (component1, component2) = randomConnection.next()

            val subgroup1 = subgroups.find(component1)
            val subgroup2 = subgroups.find(component2)

            subgroups.merge(subgroup1, subgroup2)
        }

        val wires = connections.count { (a, b) -> subgroups.find(a) != subgroups.find(b) }
        if (wires > 3) continue

        return subgroups.map { it.size }.reduce(Int::times)
    }
}

fun main() {
    val input = readInput("Day25")
    part1(input).println()
}
