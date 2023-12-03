private data class Point(val y: Int, val x: Int)

private data class CandidatePart(val number: Int, val outline: Set<Point>)

private fun parseCandidateParts(input: String): List<CandidatePart> {
    val parts = mutableListOf<CandidatePart>()

    input.lines().forEachIndexed { y, row ->
        var number = ""
        var outline = setOf<Point>()

        "$row.".forEachIndexed { x, value ->
            if (value.isDigit()) {
                if (number.isEmpty()) {
                    outline = outline + Point(y - 1, x - 1) + Point(y, x - 1) + Point(y + 1, x - 1)
                }
                number += value
                outline = outline + Point(y - 1, x) + Point(y + 1, x)
            } else if (number.isNotEmpty()) {
                outline = outline + Point(y - 1, x) + Point(y, x) + Point(y + 1, x)
                parts.add(CandidatePart(number.toInt(), outline))
                number = ""
                outline = setOf()
            }
        }
    }

    return parts.toList()
}

private fun parseSymbols(input: String, predicate: (value: Char) -> Boolean) =
    input.lines().flatMapIndexed { y, row ->
        row.foldIndexed(setOf<Point>()) { x, points, value ->
            if (predicate(value)) points + Point(y, x) else points
        }
    }.toSet()

private fun part1(input: String): Int {
    val candidates = parseCandidateParts(input)
    val symbols = parseSymbols(input) { !it.isDigit() && it != '.' }

    return candidates.sumOf { part ->
        if (part.outline.intersect(symbols).isNotEmpty()) part.number else 0
    }
}

private fun part2(input: String): Int {
    val candidates = parseCandidateParts(input)
    val gears = parseSymbols(input) { it == '*' }

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
