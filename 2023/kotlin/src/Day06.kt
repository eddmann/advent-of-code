private fun countRaceWins(recordTime: Long, recordDistance: Long) =
    (0..recordTime).count { distance -> distance * (recordTime - distance) > recordDistance }

private fun part1(input: String): Int {
    val timesAndDistances = input.lines().map { it.longs() }
    val races = timesAndDistances[0] zip timesAndDistances[1]

    return races
        .map { (time, distance) -> countRaceWins(time, distance) }
        .reduce(Int::times)
}

private fun part2(input: String): Int {
    val timeAndDistance = input.lines().map { it.replace(" ", "").longs()[0] }

    return countRaceWins(timeAndDistance[0], timeAndDistance[1])
}

fun main() {
    val input = readInput("Day06")
    part1(input).println()
    part2(input).println()
}
