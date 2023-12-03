private data class RequiredGameCubes(val id: Int, val red: Int, val green: Int, val blue: Int)

private fun parseRequiredCubesPerGame(input: String) =
    input.lines().map { line ->
        RequiredGameCubes(
            id = line.ints().first(),
            red = Regex("(\\d+) red").findAll(line).map { it.groupValues[1].toInt() }.max(),
            green = Regex("(\\d+) green").findAll(line).map { it.groupValues[1].toInt() }.max(),
            blue = Regex("(\\d+) blue").findAll(line).map { it.groupValues[1].toInt() }.max()
        )
    }

private fun part1(input: String) =
    parseRequiredCubesPerGame(input).sumOf { game ->
        if (game.red <= 12 && game.green <= 13 && game.blue <= 14) game.id else 0
    }

private fun part2(input: String) =
    parseRequiredCubesPerGame(input).sumOf { game ->
        game.red * game.green * game.blue
    }

fun main() {
    val input = readInput("Day02")
    part1(input).println()
    part2(input).println()
}
