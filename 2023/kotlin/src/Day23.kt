private enum class HikeDirection {
    UP, DOWN, LEFT, RIGHT
}

private data class HikePath(val y: Int, val x: Int) {
    fun step(direction: HikeDirection) = when (direction) {
        HikeDirection.UP -> HikePath(y - 1, x)
        HikeDirection.DOWN -> HikePath(y + 1, x)
        HikeDirection.LEFT -> HikePath(y, x - 1)
        HikeDirection.RIGHT -> HikePath(y, x + 1)
    }

    fun neighbours() =
        listOf(HikeDirection.UP, HikeDirection.DOWN, HikeDirection.LEFT, HikeDirection.RIGHT).map { step(it) }
}

private typealias HikeMap = Map<HikePath, Char>

private fun parseMap(input: String): HikeMap =
    buildMap {
        input.lines().forEachIndexed { y, row ->
            row.forEachIndexed { x, el ->
                if (el != '#') set(HikePath(y, x), el)
            }
        }
    }

private fun locateStartAndEndPath(map: HikeMap) =
    HikePath(map.minOf { it.key.y }, map.minOf { it.key.x }) to HikePath(map.maxOf { it.key.y }, map.maxOf { it.key.x })

private fun compressToJunctions(map: HikeMap, start: HikePath, end: HikePath, directionsForPath: (Char) -> List<HikeDirection>) =
    buildMap {
        val junctions = setOf(start, end) + map.keys.filter { path -> path.neighbours().count { it in map } > 2 }

        for (junction in junctions) {
            val neighbours = mutableMapOf<HikePath, Int>()

            val stack = ArrayDeque(junction.neighbours().map { it to 1 })
            val seen = mutableSetOf(junction)

            while (stack.isNotEmpty()) {
                val (path, steps) = stack.removeLast()

                if (path !in map || path in seen) continue
                seen.add(path)

                if (path in junctions) {
                    neighbours[path] = steps
                    continue
                }

                stack.addAll(directionsForPath(map[path]!!).map { path.step(it) to steps + 1 })
            }

            set(junction, neighbours.toMap())
        }
    }

private fun hike(paths: Map<HikePath, Map<HikePath, Int>>, start: HikePath, end: HikePath): Int {
    val seen = mutableSetOf<HikePath>()
    var maxSteps = 0

    fun recur(path: HikePath, steps: Int) {
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
            '^' -> listOf(HikeDirection.UP)
            'v' -> listOf(HikeDirection.DOWN)
            '<' -> listOf(HikeDirection.LEFT)
            '>' -> listOf(HikeDirection.RIGHT)
            else -> listOf(HikeDirection.UP, HikeDirection.DOWN, HikeDirection.LEFT, HikeDirection.RIGHT)
        }
    }

    return hike(paths, start, end)
}

private fun part2(input: String): Int {
    val map = parseMap(input)
    val (start, end) = locateStartAndEndPath(map)
    val paths = compressToJunctions(map, start, end) {
        listOf(HikeDirection.UP, HikeDirection.DOWN, HikeDirection.LEFT, HikeDirection.RIGHT)
    }

    return hike(paths, start, end)
}

fun main() {
    val input = readInput("Day23")
    part1(input).println()
    part2(input).println()
}
