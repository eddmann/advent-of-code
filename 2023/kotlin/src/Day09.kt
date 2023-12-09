private fun parseReport(input: String) =
    input.lines().map { it.ints() }

private fun extrapolate(history: List<Int>) =
    generateSequence(history) { seq ->
        seq.zipWithNext { a, b -> b - a }.takeIf { it.any { diff -> diff != 0 } }
    }.fold(0) {
        acc, seq -> acc + seq.last()
    }

private fun part1(input: String) =
    parseReport(input).sumOf(::extrapolate)

private fun part2(input: String) =
    parseReport(input).map { it.reversed() }.sumOf(::extrapolate)

fun main() {
    val input = readInput("Day09")
    part1(input).println()
    part2(input).println()
}
