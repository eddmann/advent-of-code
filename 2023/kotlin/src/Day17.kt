import java.util.PriorityQueue

private data class Crucible(val position: Point, val direction: Point, val forwards: Int, val heatLoss: Int) {
    val state = CrucibleState(position, direction, forwards)
}

private data class CrucibleState(val position: Point, val direction: Point, val forwards: Int)

private fun parseCity(input: String) =
    Point.mapOf(input).mapValues { it.value.digitToInt() }

private fun simulate(city: Map<Point, Int>, forwardsLimit: Int, rotateLimit: Int): Int {
    val goal = Point(city.keys.maxOf { it.y }, city.keys.maxOf { it.x })

    val queue = PriorityQueue<Crucible> { a, b -> a.heatLoss - b.heatLoss }
    queue.add(Crucible(Point.ORIGIN, Point.RIGHT, 0, 0))
    queue.add(Crucible(Point.ORIGIN, Point.DOWN, 0, 0))
    val seen = mutableSetOf<CrucibleState>()

    while (queue.isNotEmpty()) {
        val crucible = queue.poll()

        if (crucible.position == goal && crucible.forwards >= rotateLimit) {
            return crucible.heatLoss
        }

        if (crucible.state in seen) {
            continue
        }

        seen.add(crucible.state)

        val forwards = crucible.position go crucible.direction
        if (city[forwards] != null && crucible.forwards < forwardsLimit) {
            queue.add(Crucible(forwards, crucible.direction, crucible.forwards + 1, crucible.heatLoss + city[forwards]!!))
        }

        if (crucible.forwards < rotateLimit) {
            continue
        }

        val left = crucible.position go crucible.direction.rotate(-90)
        if (city[left] != null) {
            queue.add(Crucible(left, crucible.direction.rotate(-90), 1, crucible.heatLoss + city[left]!!))
        }

        val right = crucible.position go crucible.direction.rotate(90)
        if (city[right] != null) {
            queue.add(Crucible(right, crucible.direction.rotate(90), 1, crucible.heatLoss + city[right]!!))
        }
    }

    throw RuntimeException()
}

private fun part1(input: String) =
    simulate(city = parseCity(input), forwardsLimit = 3, rotateLimit = 0)

private fun part2(input: String) =
    simulate(city = parseCity(input), forwardsLimit = 10, rotateLimit = 4)

fun main() {
    val input = readInput("Day17")
    part1(input).println()
    part2(input).println()
}
