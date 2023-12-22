import kotlin.math.abs

private enum class DigDirection { UP, DOWN, LEFT, RIGHT }
private data class DigStep(val direction: DigDirection, val count: Int)

// Shoelace formula + Circumference + Initial Square
private fun area(steps: List<DigStep>): Long {
    var (py, px) = 0 to 0
    var area = 0L

    for (step in steps) {
        val (y, x) = when (step.direction) {
            DigDirection.UP -> py - step.count to px
            DigDirection.DOWN -> py + step.count to px
            DigDirection.LEFT -> py to px - step.count
            DigDirection.RIGHT -> py to px + step.count
        }

        area += 1L * (py + y) * (px - x) + step.count
        py = y
        px = x
    }

    return abs(area / 2) + 1
}

private fun part1(input: String): Long {
    val steps = input.lines().map { line ->
        val parts = line.split(" ")

        val direction = when (parts[0]) {
            "U" -> DigDirection.UP
            "D" -> DigDirection.DOWN
            "L" -> DigDirection.LEFT
            else -> DigDirection.RIGHT
        }
        val count = parts[1].toInt()

        DigStep(direction, count)
    }

    return area(steps)
}

private fun part2(input: String): Long {
    val steps = input.lines().map { line ->
        val (distanceHex, directionNo) = Regex("\\(#(.{5})(.)\\)").find(line)!!.destructured

        val direction = when (directionNo) {
            "0" -> DigDirection.RIGHT
            "1" -> DigDirection.DOWN
            "2" -> DigDirection.LEFT
            else -> DigDirection.UP
        }
        val count = distanceHex.toInt(16)

        DigStep(direction, count)
    }

    return area(steps)
}

fun main() {
    val input = readInput("Day18")
    part1(input).println()
    part2(input).println()
}
