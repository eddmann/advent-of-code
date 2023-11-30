private data class Claim(val id: Int, val x: Int, val y: Int, val width: Int, val height: Int)

private data class Square(val x: Int, val y: Int)

private fun parseClaims(input: String): List<Claim> = input.lines().map { line ->
    val parsed = line.ints()
    Claim(id=parsed[0], x=parsed[1], y=parsed[2], width=parsed[3], height=parsed[4])
}

private fun computeSquares(claim: Claim) =
    (claim.x..<(claim.x + claim.width)).flatMap { x ->
        (claim.y..<(claim.y + claim.height)).map { y ->
            Square(x, y)
        }
    }

private fun computeFabric(claims: List<Claim>): Map<Square, Int> =
    claims.flatMap { claim -> computeSquares(claim) }.groupingBy { it }.eachCount()

private fun part1(input: String) = computeFabric(parseClaims(input)).count { it.value > 1 }

private fun part2(input: String): Int {
    val claims = parseClaims(input)
    val fabric = computeFabric(claims)

    return claims.first { claim -> computeSquares(claim).all { fabric[it] == 1 } }.id
}

fun main() {
    val input = readInput("Day03")
    part1(input).println()
    part2(input).println()
}
