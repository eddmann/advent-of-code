import kotlin.io.path.Path
import kotlin.io.path.readText

fun readInput(name: String) = Path("src/$name.txt").readText()

fun Any?.println() = println(this)

fun <T> Sequence<T>.cycle(): Sequence<T> =
    generateSequence(this) { this }.flatten()

fun <T> List<T>.cycle(): Sequence<T> =
    this.asSequence().cycle()

fun String.ints() =
    Regex("(-?[0-9]+)").findAll(this).map { it.value.toInt() }.toList()

fun String.longs() =
    Regex("(-?[0-9]+)").findAll(this).map { it.value.toLong() }.toList()

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

fun gcd(a: Long, b: Long): Long = if (b == 0L) a else gcd(b, a % b)

fun lcm(a: Long, b: Long): Long = a / gcd(a, b) * b
