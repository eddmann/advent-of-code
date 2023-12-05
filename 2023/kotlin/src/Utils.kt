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
