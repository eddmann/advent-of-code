private enum class HandType {
    HIGH_CARD, ONE_PAIR, TWO_PAIR, THREE_OF_A_KIND, FULL_HOUSE, FOUR_OF_A_KIND, FIVE_OF_A_KIND
}

private open class Hand(val cards: String, open val bid: Int): Comparable<Hand> {
    protected open val type: HandType
        get() {
            val frequencies = cards.groupingBy { it }.eachCount().values.sortedDescending()

            return when (frequencies) {
                listOf(5) -> HandType.FIVE_OF_A_KIND
                listOf(4, 1) -> HandType.FOUR_OF_A_KIND
                listOf(3, 2) -> HandType.FULL_HOUSE
                listOf(3, 1, 1) -> HandType.THREE_OF_A_KIND
                listOf(2, 2, 1) -> HandType.TWO_PAIR
                listOf(2, 1, 1, 1) -> HandType.ONE_PAIR
                else -> HandType.HIGH_CARD
            }
        }

    protected open val cardRanks = "23456789TJQKA"

    override fun compareTo(other: Hand): Int {
        val comparison = this.type.compareTo(other.type)

        if (comparison != 0) {
            return comparison
        }

        cards.zip(other.cards).forEach { (a, b) ->
            val cardComparison = cardRanks.indexOf(a) - cardRanks.indexOf(b)
            if (cardComparison != 0) {
                return cardComparison
            }
        }

        return 0
    }

    companion object {
        fun of(line: String): Hand {
            val parts = line.split(" ")
            return Hand(parts.first(), parts.last().toInt())
        }
    }
}

private class WildJokerHand(cards: String, bid: Int): Hand(cards, bid) {
    override val type: HandType
        get() {
            val cardsWithoutJokers = cards.filterNot { it == 'J' }

            if (cardsWithoutJokers.isEmpty()) {
                return HandType.FIVE_OF_A_KIND
            }

            val frequencies = cardsWithoutJokers.groupingBy { it }.eachCount().values.sortedDescending().toMutableList()
            frequencies[0] += cards.length - cardsWithoutJokers.length

            return when (frequencies) {
                listOf(5) -> HandType.FIVE_OF_A_KIND
                listOf(4, 1) -> HandType.FOUR_OF_A_KIND
                listOf(3, 2) -> HandType.FULL_HOUSE
                listOf(3, 1, 1) -> HandType.THREE_OF_A_KIND
                listOf(2, 2, 1) -> HandType.TWO_PAIR
                listOf(2, 1, 1, 1) -> HandType.ONE_PAIR
                else -> HandType.HIGH_CARD
            }
        }

    override val cardRanks = "J23456789TQKA"

    companion object {
        fun of(line: String): WildJokerHand {
            val parts = line.split(" ")
            return WildJokerHand(parts.first(), parts.last().toInt())
        }
    }
}

private fun part1(input: String) =
    input
        .lines()
        .map { Hand.of(it) }
        .sorted()
        .mapIndexed { rank, hand -> (rank + 1) * hand.bid }
        .sum()

private fun part2(input: String) =
    input
        .lines()
        .map { WildJokerHand.of(it) }
        .sorted()
        .mapIndexed { rank, hand -> (rank + 1) * hand.bid }
        .sum()

fun main() {
    val input = readInput("Day07")
    part1(input).println()
    part2(input).println()
}
