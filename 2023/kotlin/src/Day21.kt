private data class Garden(val totalSize: Int, val plots: Set<Point>, val start: Point) {
    fun totalPlotsLandedOnAfterSteps(steps: Int): Long {
        var landedOn = setOf(start)

        repeat(steps) {
            landedOn = buildSet {
                landedOn.forEach { plot ->
                    plot.cardinalNeighbors().forEach { nextPlot ->
                        if (Point(nextPlot.x.mod(totalSize), nextPlot.y.mod(totalSize)) in plots) add(nextPlot)
                    }
                }
            }
        }

        return landedOn.size.toLong()
    }

    companion object {
        fun of(input: String): Garden {
            val size = input.lines().size
            var start = Point.ORIGIN
            val plots = buildSet {
                input.lines().forEachIndexed { y, row ->
                    row.forEachIndexed { x, value ->
                        if (value == 'S') start = Point(x, y)
                        if (value != '#') add(Point(x, y))
                    }
                }
            }

            return Garden(size, plots, start)
        }
    }
}

private fun part1(input: String) =
    Garden.of(input).totalPlotsLandedOnAfterSteps(64)

private fun part2(input: String): Long {
    val garden = Garden.of(input)

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
