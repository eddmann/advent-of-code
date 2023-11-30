private fun part1(input: String): Int {
    val ids = input.lines()
    val (twos, threes) = ids.fold(Pair(0, 0)) { (twos, threes), id ->
        val frequency = id.groupingBy { it }.eachCount()
        Pair(
            twos + (if (frequency.containsValue(2)) 1 else 0),
            threes + (if (frequency.containsValue(3)) 1 else 0),
        )
    }

    return twos * threes
}

private fun part2(input: String): String {
    fun checksum(comparator: (Char, Char) -> Boolean, s1: String, s2: String) =
        s1.zip(s2).fold("") { acc, (c1, c2) ->
            if (comparator(c1, c2)) "$acc$c1" else acc
        }

    val ids = input.lines()

    ids.forEach { id1 ->
        ids.forEach { id2 ->
            if (checksum({ a, b -> a != b }, id1, id2).length == 1) {
                return checksum({ a, b -> a == b }, id1, id2)
            }
        }
    }

    throw Exception()
}

fun main() {
    val input = readInput("Day02")
    part1(input).println()
    part2(input).println()
}
