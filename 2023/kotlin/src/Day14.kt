private typealias Dish = Matrix<Char>

private fun parseDish(input: String) =
    input.lines().map { it.toList() }

private fun totalLoad(dish: Dish) =
    dish.reversed().mapIndexed { idx, row -> (idx + 1) * row.count { it == 'O' } }.sum()

private fun tilt(dish: Dish) =
    dish.map { row ->
        val buffer = mutableListOf<Char>()
        val output = mutableListOf<Char>()

        for (chr in row) {
            if (chr == '#') {
                output += buffer.sortedDescending() + chr
                buffer.clear()
            } else {
                buffer += chr
            }
        }

        output + buffer.sortedDescending()
    }

private fun cycle(initialDish: Dish) =
    (1..4).fold(initialDish.transpose()) { dish, _ ->
        tilt(dish).map { it.reversed() }.transpose()
    }.transpose()

private fun part1(input: String): Int {
    val dish = parseDish(input)
    val titledNorth = tilt(dish.transpose()).transpose()
    return totalLoad(titledNorth)
}

private fun part2(input: String): Int {
    val initialDish = parseDish(input)

    val seen = mutableMapOf<Dish, Int>()
    val history = mutableListOf<Dish>()

    generateSequence(initialDish, ::cycle).forEachIndexed { idx, dish ->
        val cycleStart = seen[dish]

        if (cycleStart != null) {
            val cycleLength = idx - cycleStart
            val cyclePosition = cycleStart + (1_000_000_000 - cycleStart) % cycleLength
            return totalLoad(history[cyclePosition])
        }

        seen[dish] = idx
        history += dish
    }

    return 0
}

fun main() {
    val input = readInput("Day14")
    part1(input).println()
    part2(input).println()
}
