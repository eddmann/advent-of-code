import kotlin.math.max
import kotlin.math.min

private infix fun IntRange.intersects(other: IntRange) =
    first <= other.last && last >= other.first

private data class Point3D(val y: Int, val x: Int, val z: Int) {
    companion object {
        fun from(input: String): Point3D {
            val coordinates = input.ints()
            return Point3D(coordinates[1], coordinates[0], coordinates[2])
        }
    }
}

private data class Brick(val start: Point3D, val end: Point3D) {
    val volume =
        (start.y..end.y).flatMap { y ->
            (start.x..end.x).flatMap { x ->
                (start.z..end.z).map { z -> Point3D(y, x, z) }
            }
        }.toSet()

    private val top = max(start.z, end.z)

    val bottom = min(start.z, end.z)

    fun drop() =
        Brick(Point3D(start.y, start.x, start.z - 1), Point3D(end.y, end.x, end.z - 1))

    fun isDirectlyBelow(brick: Brick) = top + 1 == brick.bottom

    fun isSupportedBy(brick: Brick) =
        brick.isDirectlyBelow(this) && (start.x..end.x).intersects(brick.start.x..brick.end.x) && (start.y..end.y).intersects(brick.start.y..brick.end.y)

    companion object {
        fun from(input: String): Brick {
            val (start, end) = input.split("~")
            return Brick(Point3D.from(start), Point3D.from(end))
        }
    }
}

private fun parseBricks(input: String) =
    input.lines().map { Brick.from(it) }

private fun drop(bricks: List<Brick>): List<Brick> {
    val settled = mutableListOf<Brick>()

    for (brick in bricks.sortedWith { a, b -> a.bottom - b.bottom }) {
        var dropping = brick

        while (true) {
            val dropped = dropping.drop()
            if (dropped.bottom > 0 && settled.all { dropped.volume.intersect(it.volume).isEmpty() }) {
                dropping = dropped
                continue
            }

            break
        }

        settled.add(dropping)
    }

    return settled
}

private fun Set<Point3D>.canDrop(brick: Brick): Boolean =
    subtract(brick.volume).intersect(brick.drop().volume).isEmpty()

private fun canRemove(bricks: List<Brick>, index: Int): Boolean {
    val brick = bricks[index]
    val volumeWithoutSubjectBrick = bricks.flatMap { it.volume }.toSet() - brick.volume

    return !bricks.drop(index + 1).any { brick.isDirectlyBelow(it) && volumeWithoutSubjectBrick.canDrop(it) }
}

private fun chainReaction(bricks: List<Brick>, index: Int): Int {
    val brick = bricks[index]
    val removed = mutableListOf(brick)

    val volumeOfRemainingBricks = bricks.flatMap { it.volume }.toMutableSet()
    volumeOfRemainingBricks.removeAll(brick.volume)

    var chain = 0
    for (otherBrick in bricks.drop(index + 1)) {
        val wasSupported = removed.any { otherBrick.isSupportedBy(it) }
        if (wasSupported && volumeOfRemainingBricks.canDrop(otherBrick)) {
            chain += 1
            volumeOfRemainingBricks.removeAll(otherBrick.volume)
            removed.add(otherBrick)
        }
    }

    return chain
}

private fun part1(input: String): Int {
    val bricks = drop(parseBricks(input))
    return bricks.indices.count { idx -> canRemove(bricks, idx) }
}

private fun part2(input: String): Int {
    val bricks = drop(parseBricks(input))
    return bricks.indices.sumOf { idx -> chainReaction(bricks, idx) }
}

fun main() {
    val input = readInput("Day22")
    part1(input).println()
    part2(input).println()
}
