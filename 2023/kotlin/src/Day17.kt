import java.util.PriorityQueue

private enum class CrucibleDirection {
    UP, DOWN, LEFT, RIGHT;

    fun rotateLeft() = when (this) {
        UP -> LEFT
        DOWN -> RIGHT
        LEFT -> DOWN
        RIGHT -> UP
    }

    fun rotateRight() = when (this) {
        UP -> RIGHT
        DOWN -> LEFT
        LEFT -> UP
        RIGHT -> DOWN
    }
}

private data class CruciblePoint(val y: Int, val x: Int) {
    fun step(direction: CrucibleDirection) = when (direction) {
        CrucibleDirection.UP -> CruciblePoint(y - 1, x)
        CrucibleDirection.DOWN -> CruciblePoint(y + 1, x)
        CrucibleDirection.LEFT -> CruciblePoint(y, x - 1)
        CrucibleDirection.RIGHT -> CruciblePoint(y, x + 1)
    }
}

private data class Crucible(val position: CruciblePoint, val direction: CrucibleDirection, val forwards: Int, val heatLoss: Int) {
    val state = CrucibleState(position, direction, forwards)
}

private data class CrucibleState(val position: CruciblePoint, val direction: CrucibleDirection, val forwards: Int)

private fun parseCity(input: String) =
    input.lines().flatMapIndexed { y, row ->
        row.mapIndexed { x, el -> CruciblePoint(y, x) to el.digitToInt() }
    }.associate { x -> x }

private fun simulate(city: Map<CruciblePoint, Int>, forwardsLimit: Int, rotateLimit: Int): Int {
    val goal = CruciblePoint(city.keys.maxOf { it.y }, city.keys.maxOf { it.x })

    val queue = PriorityQueue<Crucible> { a, b -> a.heatLoss - b.heatLoss }
    queue.add(Crucible(CruciblePoint(0, 0), CrucibleDirection.RIGHT, 0, 0))
    queue.add(Crucible(CruciblePoint(0, 0), CrucibleDirection.DOWN, 0, 0))
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

        val forwards = crucible.position.step(crucible.direction)
        if (city[forwards] != null && crucible.forwards < forwardsLimit) {
            queue.add(Crucible(forwards, crucible.direction, crucible.forwards + 1, crucible.heatLoss + city[forwards]!!))
        }

        if (crucible.forwards < rotateLimit) {
            continue
        }

        val left = crucible.position.step(crucible.direction.rotateLeft())
        if (city[left] != null) {
            queue.add(Crucible(left, crucible.direction.rotateLeft(), 1, crucible.heatLoss + city[left]!!))
        }

        val right = crucible.position.step(crucible.direction.rotateRight())
        if (city[right] != null) {
            queue.add(Crucible(right, crucible.direction.rotateRight(), 1, crucible.heatLoss + city[right]!!))
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
