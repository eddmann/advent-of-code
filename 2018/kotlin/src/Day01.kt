private fun part1(input: String) = input.ints().sum()

private fun part2(input: String): Int {
    val changes = input.ints()

    val seen = mutableSetOf<Int>()
    var frequency = 0

    for (change in changes.cycle()) {
        frequency += change

        if (!seen.add(frequency)) {
            return frequency
        }
    }

    throw Exception()
}

fun main() {
    val input = readInput("Day01")
    part1(input).println()
    part2(input).println()
}
