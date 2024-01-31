private fun parsePatterns(input: String) =
    input.split("\n\n").map {
        pattern -> pattern.lines().map { it.toList() }
    }

private fun differences(pattern: Matrix<Char>, y: Int) =
    (y downTo 1).zip(y+1..pattern.size).sumOf { (y1, y2) ->
        (1..pattern[0].size).count { x ->
            pattern[y1 - 1][x - 1] != pattern[y2 - 1][x - 1]
        }
    }

private fun mirror(permittedDifferences: Int, pattern: Matrix<Char>) =
    (1..<pattern.size).find { y -> differences(pattern, y) == permittedDifferences } ?: 0

private fun summarise(permittedDifferences: Int, pattern: Matrix<Char>) =
    mirror(permittedDifferences, pattern) * 100 + mirror(permittedDifferences, pattern.transpose())

private fun part1(input: String) =
    parsePatterns(input).sumOf { summarise(0, it) }

private fun part2(input: String) =
    parsePatterns(input).sumOf { summarise(1, it) }

fun main() {
    val input = readInput("Day13")
    part1(input).println()
    part2(input).println()
}
