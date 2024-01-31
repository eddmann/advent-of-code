private fun parseMap(input: String) =
    Point.mapOf(input) { it != '#' }

private fun locateStartAndEndPath(map: Map<Point, Char>) =
    Point(map.minOf { it.key.x }, map.minOf { it.key.y }) to Point(map.maxOf { it.key.x }, map.maxOf { it.key.y })

private fun compressToJunctions(map: Map<Point, Char>, start: Point, end: Point, directionsForPath: (Char) -> List<Point>) =
    buildMap {
        val junctions = setOf(start, end) + map.keys.filter { path -> path.cardinalNeighbors().count { it in map } > 2 }

        for (junction in junctions) {
            val neighbours = mutableMapOf<Point, Int>()

            val stack = ArrayDeque(junction.cardinalNeighbors().map { it to 1 })
            val seen = mutableSetOf(junction)

            while (stack.isNotEmpty()) {
                val (path, steps) = stack.removeLast()

                if (path !in map || path in seen) continue
                seen.add(path)

                if (path in junctions) {
                    neighbours[path] = steps
                    continue
                }

                stack.addAll(directionsForPath(map[path]!!).map { path.go(it) to steps + 1 })
            }

            set(junction, neighbours.toMap())
        }
    }

private fun hike(paths: Map<Point, Map<Point, Int>>, start: Point, end: Point): Int {
    val seen = mutableSetOf<Point>()
    var maxSteps = 0

    fun recur(path: Point, steps: Int) {
        if (path == end) {
            maxSteps = maxOf(maxSteps, steps)
            return
        }

        seen.add(path)

        paths[path]?.forEach { (neighbour, nextSteps) ->
            if (neighbour !in seen) {
                recur(neighbour, steps + nextSteps)
            }
        }

        seen.remove(path)
    }

    recur(start, 0)

    return maxSteps
}

private fun part1(input: String): Int {
    val map = parseMap(input)
    val (start, end) = locateStartAndEndPath(map)
    val paths = compressToJunctions(map, start, end) {
        when (it) {
            '^' -> listOf(Point.UP)
            'v' -> listOf(Point.DOWN)
            '<' -> listOf(Point.LEFT)
            '>' -> listOf(Point.RIGHT)
            else -> listOf(Point.UP, Point.DOWN, Point.LEFT, Point.RIGHT)
        }
    }

    return hike(paths, start, end)
}

private fun part2(input: String): Int {
    val map = parseMap(input)
    val (start, end) = locateStartAndEndPath(map)
    val paths = compressToJunctions(map, start, end) {
        listOf(Point.UP, Point.DOWN, Point.LEFT, Point.RIGHT)
    }

    return hike(paths, start, end)
}

fun main() {
    val input = readInput("Day23")
    part1(input).println()
    part2(input).println()
}
