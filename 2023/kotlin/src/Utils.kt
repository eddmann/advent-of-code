import kotlin.io.path.Path
import kotlin.io.path.readText
import kotlin.math.absoluteValue

fun readInput(name: String) = Path("src/$name.txt").readText()

fun String.ints() =
    Regex("(-?[0-9]+)").findAll(this).map { it.value.toInt() }.toList()

fun String.longs() =
    Regex("(-?[0-9]+)").findAll(this).map { it.value.toLong() }.toList()

fun Any?.println() = println(this)

fun <T> Sequence<T>.cycle(): Sequence<T> =
    generateSequence(this) { this }.flatten()

fun <T> List<T>.cycle(): Sequence<T> =
    this.asSequence().cycle()

fun <T> Iterable<T>.combinations(length: Int): Sequence<List<T>> =
    sequence {
        val pool = this@combinations as? List<T> ?: toList()
        val n = pool.size
        if(length > n) return@sequence
        val indices = IntArray(length) { it }
        while(true) {
            yield(indices.map { pool[it] })
            var i = length
            do {
                i--
                if(i == -1) return@sequence
            } while(indices[i] == i + n - length)
            indices[i]++
            for(j in i+1 until length) indices[j] = indices[j - 1] + 1
        }
    }

typealias Matrix<T> = List<List<T>>

fun <T> Matrix<T>.transpose(): Matrix<T> =
    (0..<this[0].size).map { x -> this.indices.map { y -> this[y][x] } }

tailrec fun gcd(a: Long, b: Long): Long =
    if (b == 0L) a else gcd(b, a % b)

fun lcm(a: Long, b: Long): Long =
    a / gcd(a, b) * b

data class Point(val x: Int, val y: Int) {
    fun neighbors(): Set<Point> =
        setOf(
            this + NORTH_WEST,
            this + NORTH,
            this + NORTH_EAST,
            this + WEST,
            this + EAST,
            this + SOUTH_WEST,
            this + SOUTH,
            this + SOUTH_EAST
        )

    fun cardinalNeighbors(): Set<Point> =
        setOf(
            this + NORTH,
            this + EAST,
            this + SOUTH,
            this + WEST
        )

    fun distanceTo(other: Point): Int =
        (x - other.x).absoluteValue + (y - other.y).absoluteValue

    operator fun minus(other: Point): Point =
        Point(x - other.x, y - other.y)

    operator fun plus(other: Point): Point =
        Point(x + other.x, y + other.y)

    operator fun times(amount: Int): Point =
        Point(x * amount, y * amount)

    infix fun go(other: Point) = this + other

    fun rotate(degrees: Int = 180) =
        when ((360 + degrees) % 360) {
            0 -> Point(x, y)
            90 -> Point(-y, x)
            180 -> Point(-x, -y)
            270 -> Point(y, -x)
            else -> throw IllegalArgumentException()
        }

    companion object {
        val ORIGIN = Point(0, 0)
        val NORTH = Point(0, -1)
        val EAST = Point(1, 0)
        val SOUTH = Point(0, 1)
        val WEST = Point(-1, 0)
        val UP = NORTH
        val RIGHT = EAST
        val DOWN = SOUTH
        val LEFT = WEST
        val NORTH_WEST = NORTH + WEST
        val NORTH_EAST = NORTH + EAST
        val SOUTH_WEST = SOUTH + WEST
        val SOUTH_EAST = SOUTH + EAST

        fun of(input: String) =
            input.ints().let { (x, y) -> Point(x, y) }

        fun setOf(input: String, predicate: (Char) -> Boolean = { true }) =
            buildSet {
                input.lines().forEachIndexed { y, row ->
                    row.forEachIndexed { x, value ->
                        if (predicate(value)) add(Point(x, y))
                    }
                }
            }

        fun mapOf(input: String, predicate: (Char) -> Boolean = { true }) =
            buildMap {
                input.lines().forEachIndexed { y, row ->
                    row.forEachIndexed { x, value ->
                        if (predicate(value)) set(Point(x, y), value)
                    }
                }
            }
    }
}

data class Point3D<T: Number>(val x: T, val y: T, val z: T) {
    companion object {
        fun ofInt(input: String) =
            input.ints().let { (x, y, z) -> Point3D(x, y, z) }

        fun ofLong(input: String) =
            input.longs().let { (x, y, z) -> Point3D(x, y, z) }
    }
}
