import com.microsoft.z3.Context
import com.microsoft.z3.Status

private operator fun <T> List<T>.component6() = this[5]

private data class Intersection(val x: Double, val y: Double)

private data class Hailstone(val position: Point3D<Long>, val velocity: Point3D<Long>) {
    private val slope = velocity.y / velocity.x.toDouble()

    fun intersection(other: Hailstone): Intersection? {
        if (velocity.x == 0L || other.velocity.x == 0L || slope == other.slope) return null

        val x = ((other.position.y - other.slope * other.position.x) - (position.y - slope * position.x)) / (slope - other.slope)
        val y = slope * (x - position.x) + position.y

        val t1 = (x - position.x) / velocity.x
        val t2 = (x - other.position.x) / other.velocity.x

        if (t1 < 0 || t2 < 0) return null

        return Intersection(x, y)
    }

    companion object {
        fun of(input: String) =
            input
                .split("@")
                .let { (position, velocity) -> Hailstone(Point3D.ofLong(position), Point3D.ofLong(velocity))
        }
    }
}

private fun part1(input: String): Int {
    val hailstones = input.lines().map { Hailstone.of(it) }
    val range = 200000000000000.0..400000000000000.0

    return hailstones
        .combinations(2)
        .mapNotNull { (h1, h2) -> h1.intersection(h2) }
        .count { (x, y) -> x in range && y in range }
}

// Thank you https://www.reddit.com/r/adventofcode/comments/18pnycy/comment/kepl4p8/
//
// MacOS Z3 setup, downloaded https://github.com/Z3Prover/z3/releases/tag/z3-4.13.0 release
// and extracted bin/{libz3.dylib,libz3java.dylib} to project root
private fun part2(input: String): Long {
    val hailstones = input.lines().map { Hailstone.of(it) }

    val ctx = Context()
    val solver = ctx.mkSolver()
    val (x, y, z, vx, vy, vz) = listOf("x", "y", "z", "vx", "vy", "vz").map { ctx.mkRealConst(it) }

    hailstones.take(3).forEachIndexed() { idx, hailstone ->
        /**
         * t >= 0
         * x + vx * t == hailstone.position.x + hailstone.velocity.x * t
         * y + vy * t == hailstone.position.y + hailstone.velocity.y * t
         * z + vz * t == hailstone.position.z + hailstone.velocity.z * t
         */
        val t = ctx.mkRealConst("t$idx")
        solver.add(
            ctx.mkEq(ctx.mkAdd(x, ctx.mkMul(vx, t)), ctx.mkAdd(ctx.mkReal(hailstone.position.x), ctx.mkMul(ctx.mkReal(hailstone.velocity.x), t))),
            ctx.mkEq(ctx.mkAdd(y, ctx.mkMul(vy, t)), ctx.mkAdd(ctx.mkReal(hailstone.position.y), ctx.mkMul(ctx.mkReal(hailstone.velocity.y), t))),
            ctx.mkEq(ctx.mkAdd(z, ctx.mkMul(vz, t)), ctx.mkAdd(ctx.mkReal(hailstone.position.z), ctx.mkMul(ctx.mkReal(hailstone.velocity.z), t)))
        )
    }

    if (solver.check() != Status.SATISFIABLE) {
        throw RuntimeException()
    }

    return solver.model.eval(ctx.mkAdd(x, ctx.mkAdd(y, z)), false).toString().toLong()
}

fun main() {
    val input = readInput("Day24")
    part1(input).println()
    part2(input).println()
}
