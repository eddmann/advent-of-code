private fun calibrate(values: List<String>) = values.sumOf { value ->
    val digits = value.replace(Regex("\\D"), "")
    "${digits.first()}${digits.last()}".toInt()
}

private fun part1(input: String): Int = calibrate(input.lines())

private fun part2(input: String): Int {
    val translations = mapOf(
        "one" to "o1e",
        "two" to "t2o",
        "three" to "t3e",
        "four" to "4",
        "five" to "5e",
        "six" to "6",
        "seven" to "7n",
        "eight" to "e8t",
        "nine" to "n9e",
    )

    val values = input.lines().map { value ->
        translations.entries.fold(value) { acc, (from, to) ->
            acc.replace(from, to)
        }
    }

    return calibrate(values)
}

fun main() {
    val input = readInput("Day01")
    part1(input).println()
    part2(input).println()
}
