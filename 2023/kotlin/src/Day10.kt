private typealias Sketch = Map<Point, Char>

private data class Location(val position: Point, val direction: Point) {
    fun withDirection(nextDirection: Point) = Location(position, nextDirection)
    fun step(): Location = Location(position go direction, direction)
}

private fun findAndFillStartingPipe(sketch: Sketch): Pair<Sketch, Location> {
    val start = sketch.entries.find { it.value == 'S' }!!.key

    val up = sketch[start go Point.UP] in listOf('|', '7', 'F')
    val down = sketch[start go Point.DOWN] in listOf('|', 'L', 'J')
    val left = sketch[start go Point.LEFT] in listOf('-', 'L', 'F')
    val right = sketch[start go Point.RIGHT] in listOf('-', '7', 'J')

    if (up && right) return Pair(sketch + (start to 'L'), Location(start, Point.RIGHT))
    if (up && left) return Pair(sketch + (start to 'J'), Location(start, Point.LEFT))
    if (up && down) return Pair(sketch + (start to '|'), Location(start, Point.UP))
    if (down && right) return Pair(sketch + (start to 'F'), Location(start, Point.RIGHT))
    if (down && left) return Pair(sketch + (start to '7'), Location(start, Point.LEFT))
    return Pair(sketch + (start to '-'), Location(start, Point.RIGHT))
}

private fun nextStep(sketch: Sketch, location: Location): Location {
    val nextLocation = location.step()
    val nextValue = sketch[nextLocation.position]!!

    if (nextValue == '7' && location.direction == Point.UP) return nextLocation.withDirection(Point.LEFT)
    if (nextValue == '7' && location.direction == Point.RIGHT) return nextLocation.withDirection(Point.DOWN)
    if (nextValue == 'F' && location.direction == Point.UP) return nextLocation.withDirection(Point.RIGHT)
    if (nextValue == 'F' && location.direction == Point.LEFT) return nextLocation.withDirection(Point.DOWN)
    if (nextValue == 'L' && location.direction == Point.LEFT) return nextLocation.withDirection(Point.UP)
    if (nextValue == 'L' && location.direction == Point.DOWN) return nextLocation.withDirection(Point.RIGHT)
    if (nextValue == 'J' && location.direction == Point.DOWN) return nextLocation.withDirection(Point.LEFT)
    if (nextValue == 'J' && location.direction == Point.RIGHT) return nextLocation.withDirection(Point.UP)
    return nextLocation
}

private fun traversePipes(sketch: Sketch, initial: Location): List<Point> {
    tailrec fun recur(location: Location, route: List<Point>): List<Point> {
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
    val enlargedSketch = mutableMapOf<Point, Char>()

    sketch.forEach { entry ->
        (0..<3).forEach { offsetY ->
            (0..<3).forEach { offsetX ->
                val square = Point(entry.key.y * 3 + offsetY, entry.key.x * 3 + offsetX)
                enlargedSketch[square] = translations[entry.value]!![offsetY * 3 + offsetX]
            }
        }
    }

    return enlargedSketch.toMap()
}

private fun floodFill(sketch: Sketch): Sketch {
    val floodedSketch = sketch.toMutableMap()
    val queue = ArrayDeque(listOf(Point.ORIGIN))

    while (queue.isNotEmpty()) {
        val current = queue.removeFirst()

        floodedSketch[current] = 'x'

        current.cardinalNeighbors().forEach { nextSquare ->
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

    val sketch = mutableMapOf<Point, Char>()

    (0..maxY / 3).forEach { y ->
        (0..maxX / 3).forEach { x ->
            sketch[Point(y, x)] = enlargedSketch[Point(y * 3 + 1, x * 3 + 1)]!!
        }
    }

    return sketch.toMap()
}

private fun part1(input: String): Int {
    val sketch = Point.mapOf(input)
    val (completeSketch, start) = findAndFillStartingPipe(sketch)

    return traversePipes(completeSketch, start).size / 2
}

private fun part2(input: String) =
    Point.mapOf(input)
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
