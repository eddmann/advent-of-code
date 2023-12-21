private enum class GridDirection { UP, DOWN, LEFT, RIGHT }

private data class GridPoint(val y: Int, val x: Int) {
    fun go(direction: GridDirection) = when (direction) {
        GridDirection.UP -> GridPoint(y - 1, x)
        GridDirection.DOWN -> GridPoint(y + 1, x)
        GridDirection.LEFT -> GridPoint(y, x - 1)
        GridDirection.RIGHT -> GridPoint(y, x + 1)
    }
}

private fun parseGrid(input: String) =
    input.lines().flatMapIndexed { y, row ->
        row.mapIndexed { x, el -> GridPoint(y, x) to el }
    }.associate { x -> x }

private fun energize(grid: Map<GridPoint, Char>, initialPosition: GridPoint, initialDirection: GridDirection): Int {
    val queue = mutableListOf(Pair(initialPosition, initialDirection))
    val energized = mutableSetOf<Pair<GridPoint, GridDirection>>()

    while (queue.isNotEmpty()) {
        val state = queue.removeFirst()
        val (position, direction) = state

        if (!grid.containsKey(position) || state in energized) {
            continue
        }

        energized += state

        when (grid[position]) {
            '.' -> {
                queue.add(Pair(position.go(direction), direction))
            }
            '/' -> {
                val nextDirection = when (direction) {
                    GridDirection.UP -> GridDirection.RIGHT
                    GridDirection.DOWN -> GridDirection.LEFT
                    GridDirection.LEFT -> GridDirection.DOWN
                    GridDirection.RIGHT -> GridDirection.UP
                }
                queue.add(Pair(position.go(nextDirection), nextDirection))
            }
            '\\' -> {
                val nextDirection = when (direction) {
                    GridDirection.UP -> GridDirection.LEFT
                    GridDirection.DOWN -> GridDirection.RIGHT
                    GridDirection.LEFT -> GridDirection.UP
                    GridDirection.RIGHT -> GridDirection.DOWN
                }
                queue.add(Pair(position.go(nextDirection), nextDirection))
            }
            '-' -> {
                when (direction) {
                    GridDirection.LEFT, GridDirection.RIGHT -> {
                        queue.add(Pair(position.go(direction), direction))
                    }
                    GridDirection.UP, GridDirection.DOWN -> {
                        queue.add(Pair(position.go(GridDirection.LEFT), GridDirection.LEFT))
                        queue.add(Pair(position.go(GridDirection.RIGHT), GridDirection.RIGHT))
                    }
                }
            }
            '|' -> {
                when (direction) {
                    GridDirection.UP, GridDirection.DOWN -> {
                        queue.add(Pair(position.go(direction), direction))
                    }
                    GridDirection.LEFT, GridDirection.RIGHT -> {
                        queue.add(Pair(position.go(GridDirection.UP), GridDirection.UP))
                        queue.add(Pair(position.go(GridDirection.DOWN), GridDirection.DOWN))
                    }
                }
            }
        }
    }

    return energized.map { it.first }.distinct().size
}

private fun part1(input: String) =
    energize(parseGrid(input), GridPoint(0, 0), GridDirection.RIGHT)

private fun part2(input: String): Int {
    val grid = parseGrid(input)

    val maxY = grid.keys.maxOf { it.y }
    val maxX = grid.keys.maxOf { it.x }

    val ys = (0..maxY).flatMap { y ->
        listOf(
            energize(grid, GridPoint(y, maxX), GridDirection.LEFT),
            energize(grid, GridPoint(y, 0), GridDirection.RIGHT)
        )
    }
    val xs = (0..maxX).flatMap { x ->
        listOf(
            energize(grid, GridPoint(maxY, x), GridDirection.UP),
            energize(grid, GridPoint(0, x), GridDirection.DOWN)
        )
    }

    return (ys + xs).max()
}

fun main() {
    val input = readInput("Day16")
    part1(input).println()
    part2(input).println()
}
