import kotlin.math.pow

private infix fun Int.`**`(exponent: Int): Int = toDouble().pow(exponent).toInt()

private data class Card(val id: Int, val numbers: Set<Int>, val winners: Set<Int>)

private fun parseCards(input: String): List<Card> =
    input.lines().map { line ->
        val (id, numbers, winners) = Regex("Card\\s+(\\d+): (.+) \\| (.+)").find(line)!!.destructured
        Card(id.toInt(), numbers.ints().toSet(), winners.ints().toSet())
    }

private fun part1(input: String): Int =
    parseCards(input).sumOf { card ->
        val matches = card.numbers.intersect(card.winners).size
        if (matches > 0) 2 `**` (matches - 1) else 0
    }

private fun part2(input: String): Int {
    val cards = parseCards(input)
    val tally = cards.associate { it.id to 1 }.toMutableMap()

    for (card in cards) {
        val matches = card.numbers.intersect(card.winners).size
        if (matches == 0) continue;

        for (id in card.id + 1..matches + card.id) {
            if (!tally.containsKey(id)) break;
            tally[id] = tally[id]!! + tally[card.id]!!
        }
    }

    return tally.values.sum()
}

fun main() {
    val input = readInput("Day04")
    part1(input).println()
    part2(input).println()
}
