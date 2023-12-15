private data class Record(val springs: String, val criteria: List<Int>)

private fun parseRecords(input: String) =
    input.lines().map { line ->
        val springsAndCriteria = line.split(" ")
        Record(springsAndCriteria[0], springsAndCriteria[1].ints())
    }

private fun damagedSpring(springs: String, criteria: List<Int>): Long {
    val groupSize = criteria.first()

    val potentialGroup = springs.take(groupSize).replace('?', '#')

    if (potentialGroup != "#".repeat(groupSize)) {
        return 0
    }

    if (springs.length == groupSize) {
        return if (criteria.size == 1) { 1 } else { 0 }
    }

    if (springs[groupSize] != '#') {
        return arrangements(springs.drop(groupSize + 1), criteria.drop(1))
    }

    return 0
}

private val cache = mutableMapOf<Pair<String, List<Int>>, Long>()

private fun arrangements(springs: String, criteria: List<Int>): Long {
    val result = cache[Pair(springs, criteria)]

    if (result != null) {
        return result
    }

    if (criteria.isEmpty()) {
        return if (springs.all { it != '#' }) { 1 } else { 0 }
    }

    if (springs.isEmpty()) {
        return 0
    }

    val value = when (springs[0]) {
        '#' -> damagedSpring(springs, criteria)
        '.' -> arrangements(springs.drop(1), criteria)
        '?' -> damagedSpring(springs, criteria) + arrangements(springs.drop(1), criteria)
        else -> throw RuntimeException()
    }

    cache[Pair(springs, criteria)] = value

    return value
}

private fun part1(input: String) =
    parseRecords(input).sumOf { arrangements(it.springs, it.criteria) }

private fun part2(input: String) =
    parseRecords(input).sumOf { record ->
        val expandedSprings = (1..5).map { record.springs }.joinToString("?")
        val expandedCriteria = (1..5).fold(listOf<Int>()) { criteria, _ -> criteria + record.criteria }
        0L + arrangements(expandedSprings, expandedCriteria)
    }

fun main() {
    val input = readInput("Day12")
    part1(input).println()
    part2(input).println()
}
