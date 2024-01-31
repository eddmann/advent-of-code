private fun parseGalaxies(input: String) =
    Point.setOf(input) { it == '#' }

private fun determineExtraSpace(input: String): Pair<List<Int>, List<Int>> {
    val lines = input.lines()
    val extraRows = lines.mapIndexedNotNull { coord, line -> if (line.all { it == '.' }) coord else null }
    val extraCols = (0..<lines[0].length).mapNotNull { coord -> if (lines.map { it[coord] }.all { it == '.' }) coord else null }

    return extraRows to extraCols
}

private fun part1(input: String): Int {
    val galaxies = parseGalaxies(input)
    val (extraRows, extraCols) = determineExtraSpace(input)

    return galaxies.combinations(2).sumOf { pair ->
        val totalExtraRows = extraRows.count { y -> y in (pair.minOf { it.y }..pair.maxOf { it.y }) }
        val totalExtraCols = extraCols.count { x -> x in (pair.minOf { it.x }..pair.maxOf { it.x }) }

        pair[0].distanceTo(pair[1]) + totalExtraRows + totalExtraCols
    }
}

private fun part2(input: String): Long {
    val galaxies = parseGalaxies(input)
    val (extraRows, extraCols) = determineExtraSpace(input)

    return galaxies.combinations(2).sumOf { pair ->
        val totalExtraRows = extraRows.count { y -> y in (pair.minOf { it.y }..pair.maxOf { it.y }) } * 999_999
        val totalExtraCols = extraCols.count { x -> x in (pair.minOf { it.x }..pair.maxOf { it.x }) } * 999_999
        0L + pair[0].distanceTo(pair[1]) + totalExtraRows + totalExtraCols
    }
}

fun main() {
    val input = readInput("Day11")
    part1(input).println()
    part2(input).println()
}
