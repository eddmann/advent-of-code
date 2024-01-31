private data class CandidatePart(val number: Int, val outline: Set<Point>)

private fun parseCandidateParts(input: String): List<CandidatePart> {
    val parts = mutableListOf<CandidatePart>()

    input.lines().forEachIndexed { y, row ->
        var number = ""
        var outline = setOf<Point>()

        "$row.".forEachIndexed { x, value ->
            if (value.isDigit()) {
                if (number.isEmpty()) {
                    outline = outline + Point(x - 1, y - 1) + Point(x - 1, y) + Point(x - 1, y + 1)
                }
                number += value
                outline = outline + Point(x, y - 1) + Point(x, y + 1)
            } else if (number.isNotEmpty()) {
                outline = outline + Point(x, y - 1) + Point(x, y) + Point(x, y + 1)
                parts.add(CandidatePart(number.toInt(), outline))
                number = ""
                outline = setOf()
            }
        }
    }

    return parts.toList()
}

private fun part1(input: String): Int {
    val candidates = parseCandidateParts(input)
    val symbols = Point.setOf(input) { !it.isDigit() && it != '.' }

    return candidates.sumOf { part ->
        if (part.outline.intersect(symbols).isNotEmpty()) part.number else 0
    }
}

private fun part2(input: String): Int {
    val candidates = parseCandidateParts(input)
    val gears = Point.setOf(input) { it == '*' }

    return gears.sumOf { gear ->
        val parts = candidates.filter { it.outline.contains(gear) }
        if (parts.size == 2) parts[0].number * parts[1].number else 0
    }
}

fun main() {
    val input = readInput("Day03")
    part1(input).println()
    part2(input).println()
}
