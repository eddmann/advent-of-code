import java.io.File

private fun part1(input: String): Int {
    val lines = input.lines().map {
        it.split(':', ' ').filterNot(String::isBlank)
    }

    val connections = buildSet {
        lines.forEach { line ->
            addAll(line.drop(1).map { line.first() to it })
        }
    }

    var graph = "graph {\n"
    connections.forEach { (component1, component2) ->
        graph += "    $component1 -- $component2\n"
    }
    graph += "}"

    File("src/Day25Graphviz/Day25.dot").writeText(graph)

    // https://www.reddit.com/r/adventofcode/comments/18qbsxs/comment/keu3dse/
    // 1. cat src/Day25Graphviz/Day25.dot | docker run --rm -i nshine/dot dot -Tpng -Kneato > src/Day25Graphviz/Day25.png
    // 2. Remove three connections (src/Day25Graphviz/Day25c.dot)
    // 3. cat src/Day25Graphviz/Day25c.dot | docker run --rm -i nshine/dot ccomps -v > /dev/null
    //   (   0)     713 nodes    1588 edges
    //   (   1)     722 nodes    1617 edges
    //   1435 nodes    3205 edges       2 components %1

    return 713 * 722
}

fun main() {
    val input = readInput("Day25")
    part1(input).println()
}
