import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.async
import kotlinx.coroutines.awaitAll
import kotlinx.coroutines.runBlocking
import kotlin.time.measureTime

private typealias Seeds = List<Long>
private typealias Map = List<MapRange>

private data class SeedRange(val start: Long, val length: Long) {
    fun contains(value: Long) =
        value >= start && value < start + length

    companion object {
        fun fromSeeds(seeds: Seeds): List<SeedRange> =
            seeds.chunked(2).map { SeedRange(it[0], it[1]) }
    }
}

private data class MapRange(val source: Long, val destination: Long, val length: Long) {
    fun forwards(value: Long): Long? =
        if (value >= source && value < source + length) destination + value - source
        else null

    fun backwards(value: Long): Long? =
        if (value >= destination && value < destination + length) source + value - destination
        else null
}

private fun parseAlmanac(input: String): Pair<Seeds, List<Map>> {
    val parsed = Regex("[^0-9]+:").split(input)

    val seeds = parsed[1].longs()
    val maps = parsed.drop(2).map { map ->
        map.longs().chunked(3).map { MapRange(it[1], it[0], it[2]) }
    }

    return seeds to maps
}

private fun toLocation(maps: List<Map>, seed: Long): Long =
    maps.fold(seed) { value, map ->
        for (range in map) {
            range.forwards(value)?.let { return@fold it }
        }
        value
    }

private fun toSeed(maps: List<Map>, location: Long): Long =
    maps.foldRight(location) { map, value ->
        for (range in map) {
            range.backwards(value)?.let { return@foldRight it }
        }
        value
    }

private fun part1(input: String): Long {
    val (seeds, mappings) = parseAlmanac(input)
    return seeds.minOf { toLocation(mappings, it) }
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

private fun part2Coroutines(input: String): Long {
    val (seeds, mappings) = parseAlmanac(input)
    val seedRanges = buildList {
        SeedRange.fromSeeds(seeds).forEach { range ->
            val end = range.start + range.length
            var current = range.start
            while (current + 50_000_000 < end) {
                add(current..current + 50_000_000)
                current += 50_000_000
            }
            add(current..end)
        }
    }

    return runBlocking(Dispatchers.Default) {
        seedRanges.map { range ->
            async {
                range.minOf { toLocation(mappings, it) }
            }
        }.awaitAll().min()
    }
}

private fun part2ParallelStream(input: String): Long {
    val (seeds, mappings) = parseAlmanac(input)
    val seedRanges = buildList {
        SeedRange.fromSeeds(seeds).forEach { range ->
            val end = range.start + range.length
            var current = range.start
            while (current + 50_000_000 < end) {
                add(current..current + 50_000_000)
                current += 50_000_000
            }
            add(current..end)
        }
    }

    return seedRanges
        .parallelStream()
        .map { range -> range.minOf { toLocation(mappings, it) } }
        .min(Long::compareTo)
        .get()
}

fun main() {
    val input = readInput("Day05")
    part1(input).println()
    measureTime { part2(input).println() }.println() // 1.874070296s
    measureTime { part2Coroutines(input).println() }.println() // 1m 18.822712617s
    measureTime { part2ParallelStream(input).println() }.println() // 1m 14.793719775s
}
