private typealias Seeds = List<Long>
private typealias Map = List<MapRange>

private data class SeedRange(val start: Long, val length: Long) {
    fun contains(value: Long) =
        value >= start && value < start + length

    companion object {
        fun fromSeeds(seeds: Seeds): List<SeedRange> {
            return seeds.chunked(2).map { SeedRange(it[0], it[1]) }
        }
    }
}

private data class MapRange(val source: Long, val destination: Long, val length: Long) {
    fun forwards(value: Long): Long? =
        if (value >= source && value < source + length) { destination + value - source } else { null }

    fun backwards(value: Long): Long? =
        if (value >= destination && value < destination + length) { value - destination + source } else { null }
}

private fun parseAlmanac(input: String): Pair<Seeds, List<Map>> {
    val parsed = Regex("[^0-9]+:").split(input)

    val seeds = parsed[1].longs()
    val maps = parsed.drop(2).map { map ->
        map.longs().chunked(3).map { MapRange(it[1], it[0], it[2]) }
    }

    return Pair(seeds, maps)
}

private fun toLocation(maps: List<Map>, seed: Long): Long =
    maps.fold(seed) { value, map ->
        for (range in map) {
            range.forwards(value)?.let { return@fold it }
        }
        return@fold value
    }

private fun toSeed(maps: List<Map>, location: Long): Long =
    maps.foldRight(location) { map, value ->
        for (range in map) {
            range.backwards(value)?.let { return@foldRight it }
        }
        return@foldRight value
    }

private fun part1(input: String): Long {
    val (seeds, mappings) = parseAlmanac(input)
    return seeds.map { toLocation(mappings, it) }.min()
}

private fun part2(input: String): Long {
    val (seeds, mappings) = parseAlmanac(input)
    val seedRanges = SeedRange.fromSeeds(seeds)

    var location = 0L
    while (true) {
        val seed = toSeed(mappings, location)
        if (seedRanges.any { it.contains(seed ) }) {
            return location
        }
        location += 1
    }
}

fun main() {
    val input = readInput("Day05")
    part1(input).println()
    part2(input).println()
}
