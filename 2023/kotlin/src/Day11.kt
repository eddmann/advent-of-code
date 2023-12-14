import kotlin.math.abs

private data class SpacePoint(val y: Int, val x: Int)

private fun manhattanDistance(a: SpacePoint, b: SpacePoint) =
    abs(a.y - b.y) + abs(a.x - b.x)

private fun parseGalaxies(input: String) =
    input.lines().flatMapIndexed { y, row ->
        row.mapIndexed { x, el ->
            if (el == '#') { SpacePoint(y, x) } else { null }
        }.filterNotNull()
    }

private fun determineExtraSpace(input: String): Pair<List<Int>, List<Int>> {
    val lines = input.lines()
    val extraRows = lines.mapIndexedNotNull { coord, line -> if (line.all { it == '.' }) { coord } else { null } }
    val extraCols = (0..<lines[0].length).mapNotNull { coord -> if (lines.map { it[coord] }.all { it == '.' }) { coord } else { null } }

    return Pair(extraRows, extraCols)
}

private fun part1(input: String): Int {
    val galaxies = parseGalaxies(input)
    val (extraRows, extraCols) = determineExtraSpace(input)

    return galaxies.combinations(2).sumOf { pair ->
        val totalExtraRows = extraRows.count { y -> (pair.minOf { it.y }..pair.maxOf { it.y }).contains(y) }
        val totalExtraCols = extraCols.count { x -> (pair.minOf { it.x }..pair.maxOf { it.x }).contains(x) }
        manhattanDistance(pair[0], pair[1]) + totalExtraRows + totalExtraCols
    }
}

private fun part2(input: String): Long {
    val galaxies = parseGalaxies(input)
    val (extraRows, extraCols) = determineExtraSpace(input)

    return galaxies.combinations(2).sumOf { pair ->
        val totalExtraRows = extraRows.count { y -> (pair.minOf { it.y }..pair.maxOf { it.y }).contains(y) } * 999_999
        val totalExtraCols = extraCols.count { x -> (pair.minOf { it.x }..pair.maxOf { it.x }).contains(x) } * 999_999
        0L + manhattanDistance(pair[0], pair[1]) + totalExtraRows + totalExtraCols
    }
}

fun main() {
    val input = readInput("Day11")
    part1(input).println()
    part2(input).println()
}
