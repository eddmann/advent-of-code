private enum class Instruction { LEFT, RIGHT }

private typealias Position = String
private typealias Mapping = Map<Position, MapDirection>

private data class MapDirection(val left: Position, val right: Position)

private fun parseInstructionsAndMap(input: String): Pair<List<Instruction>, Mapping> {
    val parts = input.split("\n\n")

    val instructions = parts[0].map { if (it == 'L') Instruction.LEFT else Instruction.RIGHT }

    val map = parts[1]
        .lines()
        .associate { line ->
            val (position, left, right) = Regex("([A-Z0-9]{3}).*([A-Z0-9]{3}).*([A-Z0-9]{3})").find(line)!!.destructured
            position to MapDirection(left, right)
        }

    return instructions to map
}

private fun countSteps(instructions: List<Instruction>, map: Mapping, initial: Position): Int {
    var position = initial

    instructions.cycle().forEachIndexed { steps, instruction ->
        position = if (instruction == Instruction.LEFT) map[position]!!.left else map[position]!!.right

        if (position.endsWith("Z")) {
            return steps + 1
        }
    }

    return 0
}

private fun part1(input: String) =
    parseInstructionsAndMap(input).let {
        (instructions, map) -> countSteps(instructions, map, "AAA")
    }

private fun part2(input: String): Long {
    val (instructions, map) = parseInstructionsAndMap(input)

    return map
        .keys
        .filter { it.endsWith("A") }
        .map { countSteps(instructions, map, it).toLong() }
        .reduce(::lcm)
}

fun main() {
    val input = readInput("Day08")
    part1(input).println()
    part2(input).println()
}
