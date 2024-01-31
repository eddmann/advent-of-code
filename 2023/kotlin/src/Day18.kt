import kotlin.math.abs

private data class DigStep(val direction: Point, val count: Int)

// Shoelace formula + Circumference + Initial Square
private fun area(steps: List<DigStep>): Long {
    var (py, px) = 0 to 0
    var area = 0L

    for (step in steps) {
        val (y, x) = when (step.direction) {
            Point.UP -> py - step.count to px
            Point.DOWN -> py + step.count to px
            Point.LEFT -> py to px - step.count
            else -> py to px + step.count
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
            "U" -> Point.UP
            "D" -> Point.DOWN
            "L" -> Point.LEFT
            else -> Point.RIGHT
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
            "0" -> Point.RIGHT
            "1" -> Point.DOWN
            "2" -> Point.LEFT
            else -> Point.UP
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
