private typealias Sketch = Map<Square, Char>

private enum class Direction { UP, DOWN, LEFT, RIGHT }

private data class Square(val y: Int, val x: Int) {
    fun go(direction: Direction) = when (direction) {
        Direction.UP -> Square(y - 1, x)
        Direction.DOWN -> Square(y + 1, x)
        Direction.LEFT -> Square(y, x - 1)
        Direction.RIGHT -> Square(y, x + 1)
    }
}

private data class Location(val position: Square, val direction: Direction) {
    fun withDirection(nextDirection: Direction) = Location(position, nextDirection)
    fun step(): Location = Location(position.go(direction), direction)
}

private fun parseSketch(input: String) =
    input.lines().flatMapIndexed { y, row ->
        row.mapIndexed { x, el -> Pair(Square(y, x), el) }
    }.associate { x -> x }


private fun findAndFillStartingPipe(sketch: Sketch): Pair<Sketch, Location> {
    val start = sketch.entries.find { it.value == 'S' }!!.key

    val up = listOf('|', '7', 'F').contains(sketch[start.go(Direction.UP)])
    val down = listOf('|', 'L', 'J').contains(sketch[start.go(Direction.DOWN)])
    val left = listOf('-', 'L', 'F').contains(sketch[start.go(Direction.LEFT)])
    val right = listOf('-', '7', 'J').contains(sketch[start.go(Direction.RIGHT)])

    if (up && right) return Pair(sketch + (start to 'L'), Location(start, Direction.RIGHT))
    if (up && left) return Pair(sketch + (start to 'J'), Location(start, Direction.LEFT))
    if (up && down) return Pair(sketch + (start to '|'), Location(start, Direction.UP))
    if (down && right) return Pair(sketch + (start to 'F'), Location(start, Direction.RIGHT))
    if (down && left) return Pair(sketch + (start to '7'), Location(start, Direction.LEFT))
    return Pair(sketch + (start to '-'), Location(start, Direction.RIGHT))
}

private fun nextStep(sketch: Sketch, location: Location): Location {
    val nextLocation = location.step()
    val nextValue = sketch[nextLocation.position]!!

    if (nextValue == '7' && location.direction == Direction.UP) return nextLocation.withDirection(Direction.LEFT)
    if (nextValue == '7' && location.direction == Direction.RIGHT) return nextLocation.withDirection(Direction.DOWN)
    if (nextValue == 'F' && location.direction == Direction.UP) return nextLocation.withDirection(Direction.RIGHT)
    if (nextValue == 'F' && location.direction == Direction.LEFT) return nextLocation.withDirection(Direction.DOWN)
    if (nextValue == 'L' && location.direction == Direction.LEFT) return nextLocation.withDirection(Direction.UP)
    if (nextValue == 'L' && location.direction == Direction.DOWN) return nextLocation.withDirection(Direction.RIGHT)
    if (nextValue == 'J' && location.direction == Direction.DOWN) return nextLocation.withDirection(Direction.LEFT)
    if (nextValue == 'J' && location.direction == Direction.RIGHT) return nextLocation.withDirection(Direction.UP)
    return nextLocation
}

private fun traversePipes(sketch: Sketch, initial: Location): List<Square> {
    tailrec fun recur(location: Location, route: List<Square>): List<Square> {
        val nextLocation = nextStep(sketch, location)
        if (nextLocation == initial) {
            return route + location.position
        }
        return recur(nextLocation, route + location.position)
    }
    return recur(initial, listOf(initial.position))
}

private fun removeUnconnectedPipes(sketch: Sketch): Sketch {
    val (completeSketch, start) = findAndFillStartingPipe(sketch)
    val route = traversePipes(completeSketch, start)

    val cleanSketch = completeSketch.toMutableMap()
    completeSketch.forEach {
        if (!route.contains(it.key)) {
            cleanSketch[it.key] = '.'
        }
    }

    return cleanSketch.toMap()
}

private fun enlargeSketch(sketch: Sketch): Sketch {
    val translations = mapOf(
        '|' to ".|..|..|.",
        'F' to "....F-.|.",
        'L' to ".|..L-...",
        'J' to ".|.-J....",
        '7' to "...-7..|.",
        '-' to "...---...",
        '.' to ".........",
    )
    val enlargedSketch = mutableMapOf<Square, Char>()

    sketch.forEach { entry ->
        (0..<3).forEach { offsetY ->
            (0..<3).forEach { offsetX ->
                val square = Square(entry.key.y * 3 + offsetY, entry.key.x * 3 + offsetX)
                enlargedSketch[square] = translations[entry.value]!![offsetY * 3 + offsetX]
            }
        }
    }

    return enlargedSketch.toMap()
}

private fun floodFill(sketch: Sketch): Sketch {
    val floodedSketch = sketch.toMutableMap()
    val queue = ArrayDeque(listOf(Square(0, 0)))

    while (queue.isNotEmpty()) {
        val current = queue.removeFirst()

        floodedSketch[current] = 'x'

        listOf(Direction.UP, Direction.DOWN, Direction.LEFT, Direction.RIGHT).forEach { direction ->
            val nextSquare = current.go(direction)
            if (floodedSketch.getOrDefault(nextSquare, ' ') == '.' && !queue.contains(nextSquare)) {
                queue.add(nextSquare)
            }
        }
    }

    return floodedSketch.toMap()
}

private fun shrinkSketch(enlargedSketch: Sketch): Sketch {
    val maxX = enlargedSketch.keys.map { it.x }.max()
    val maxY = enlargedSketch.keys.map { it.y }.max()

    val sketch = mutableMapOf<Square, Char>()

    (0..maxY / 3).forEach { y ->
        (0..maxX / 3).forEach { x ->
            sketch[Square(y, x)] = enlargedSketch[Square(y * 3 + 1, x * 3 + 1)]!!
        }
    }

    return sketch.toMap()
}

private fun part1(input: String): Int {
    val sketch = parseSketch(input)
    val (completeSketch, start) = findAndFillStartingPipe(sketch)

    return traversePipes(completeSketch, start).size / 2
}

private fun part2(input: String) =
    parseSketch(input)
        .let(::removeUnconnectedPipes)
        .let(::enlargeSketch)
        .let(::floodFill)
        .let(::shrinkSketch)
        .count { it.value == '.' }

fun main() {
    val input = readInput("Day10")
    part1(input).println()
    part2(input).println()
}
