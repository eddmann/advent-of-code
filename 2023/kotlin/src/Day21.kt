private enum class StepDirection {
    UP, DOWN, LEFT, RIGHT
}

private data class StepPoint(val y: Int, val x: Int) {
    fun step(direction: StepDirection) = when (direction) {
        StepDirection.UP -> StepPoint(y - 1, x)
        StepDirection.DOWN -> StepPoint(y + 1, x)
        StepDirection.LEFT -> StepPoint(y, x - 1)
        StepDirection.RIGHT -> StepPoint(y, x + 1)
    }

    fun neighbours() =
        listOf(StepDirection.UP, StepDirection.DOWN, StepDirection.LEFT, StepDirection.RIGHT).map { step(it) }
}

private data class Garden(val size: Int, val plots: Set<StepPoint>, val start: StepPoint) {
    fun totalPlotsLandedOnAfterSteps(steps: Int): Long {
        var landedOn = setOf(start)

        repeat(steps) {
            landedOn = landedOn.flatMap { plot ->
                plot.neighbours().mapNotNull { nextPlot ->
                    if (StepPoint(nextPlot.y.mod(size), nextPlot.x.mod(size)) in plots) nextPlot else null
                }
            }.toSet()
        }

        return landedOn.size.toLong()
    }

    companion object {
        fun from(input: String): Garden {
            val size = input.lines().size
            var start = StepPoint(0, 0)
            val plots = input.lines().flatMapIndexed { y, row ->
                row.mapIndexedNotNull { x, el ->
                    if (el == 'S') start = StepPoint(y, x)
                    if (el != '#') { StepPoint(y, x) } else { null }
                }
            }.toSet()

            return Garden(size, plots, start)
        }
    }
}

private fun part1(input: String) =
    Garden.from(input).totalPlotsLandedOnAfterSteps(64)

private fun part2(input: String): Long {
    val garden = Garden.from(input)

    val target = (26_501_365 - 65) / 131;
    val ys = listOf(
        garden.totalPlotsLandedOnAfterSteps(65),
        garden.totalPlotsLandedOnAfterSteps(65 + 131),
        garden.totalPlotsLandedOnAfterSteps(65 + 2 * 131),
    )

    // Simplified Lagrange's interpolation formula
    // https://www.wolframalpha.com/input?i=quadratic+fit+calculator&assumption=%7B%22F%22%2C+%22QuadraticFitCalculator%22%2C+%22data3x%22%7D+-%3E%22%7B0%2C+1%2C+2%7D%22&assumption=%7B%22F%22%2C+%22QuadraticFitCalculator%22%2C+%22data3y%22%7D+-%3E%22%7B3835%2C+34125%2C+94603%7D%22
    return ys
        .mapIndexed { idx, y ->
            ys.indices.filterNot { it == idx }.fold(y) { acc, x ->
                acc * (target - x) / (idx - x)
            }
        }
        .sum()
}

fun main() {
    val input = readInput("Day21")
    part1(input).println()
    part2(input).println()
}
