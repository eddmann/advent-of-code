private fun energize(grid: Map<Point, Char>, initialPosition: Point, initialDirection: Point): Int {
    val queue = mutableListOf(Pair(initialPosition, initialDirection))
    val energized = mutableSetOf<Pair<Point, Point>>()

    while (queue.isNotEmpty()) {
        val state = queue.removeFirst()
        val (position, direction) = state

        if (!grid.containsKey(position) || state in energized) {
            continue
        }

        energized += state

        when (grid[position]) {
            '.' -> {
                queue.add(position.go(direction) to direction)
            }
            '/' -> {
                val nextDirection = when (direction) {
                    Point.UP -> Point.RIGHT
                    Point.DOWN -> Point.LEFT
                    Point.LEFT -> Point.DOWN
                    else -> Point.UP
                }
                queue.add(position.go(nextDirection) to nextDirection)
            }
            '\\' -> {
                val nextDirection = when (direction) {
                    Point.UP -> Point.LEFT
                    Point.DOWN -> Point.RIGHT
                    Point.LEFT -> Point.UP
                    else -> Point.DOWN
                }
                queue.add(position.go(nextDirection) to nextDirection)
            }
            '-' -> {
                when (direction) {
                    Point.LEFT, Point.RIGHT -> {
                        queue.add(position.go(direction) to direction)
                    }
                    Point.UP, Point.DOWN -> {
                        queue.add(position.go(Point.LEFT) to Point.LEFT)
                        queue.add(position.go(Point.RIGHT) to Point.RIGHT)
                    }
                }
            }
            '|' -> {
                when (direction) {
                    Point.UP, Point.DOWN -> {
                        queue.add(position.go(direction) to direction)
                    }
                    Point.LEFT, Point.RIGHT -> {
                        queue.add(position.go(Point.UP) to Point.UP)
                        queue.add(position.go(Point.DOWN) to Point.DOWN)
                    }
                }
            }
        }
    }

    return energized.map { it.first }.distinct().size
}

private fun part1(input: String) =
    energize(Point.mapOf(input), Point.ORIGIN, Point.RIGHT)

private fun part2(input: String): Int {
    val grid = Point.mapOf(input)

    val maxY = grid.keys.maxOf { it.y }
    val maxX = grid.keys.maxOf { it.x }

    val ys = (0..maxY).flatMap { y ->
        listOf(
            energize(grid, Point(maxX, y), Point.LEFT),
            energize(grid, Point(0, y), Point.RIGHT)
        )
    }
    val xs = (0..maxX).flatMap { x ->
        listOf(
            energize(grid, Point(x, maxY), Point.UP),
            energize(grid, Point(x, 0), Point.DOWN)
        )
    }

    return (ys + xs).max()
}

fun main() {
    val input = readInput("Day16")
    part1(input).println()
    part2(input).println()
}
