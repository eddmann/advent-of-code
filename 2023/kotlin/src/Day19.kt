private typealias Workflows = Map<String, Workflow>
private data class Workflow(val rules: List<Rule>, val default: String)
private data class Rule(val category: Char, val comparator: Char, val value: Int, val consequence: String)

private typealias Rating = Map<Char, Int>
private typealias RatingRange = Map<Char, IntRange>

private fun parseWorkflowsAndRatings(input: String): Pair<Workflows, List<Rating>> {
    val workflowsAndRatings = input.split("\n\n")

    val workflows = workflowsAndRatings[0].lines().associate { workflow ->
        val (name, rawRulesAndDefault) = Regex("(.+)\\{(.+)\\}").find(workflow)!!.destructured
        val rulesAndDefault = rawRulesAndDefault.split(",")

        val rules = rulesAndDefault.dropLast(1).map { rule ->
            val (category, comparator, value, consequence) = Regex("(.)([<>])(\\d+):(.+)").find(rule)!!.destructured
            Rule(category[0], comparator[0], value.toInt(), consequence)
        }
        val default = rulesAndDefault.last()

        name to Workflow(rules, default)
    }

    val ratings = workflowsAndRatings[1].lines().map { rating ->
        val categories = rating.ints()
        mapOf('x' to categories[0], 'm' to categories[1], 'a' to categories[2], 's' to categories[3])
    }

    return Pair(workflows, ratings)
}

private fun part1(input: String): Int {
    val (workflows, ratings) = parseWorkflowsAndRatings(input)

    fun isAccepted(rating: Map<Char, Int>, workflowName: String): Boolean {
        if (workflowName == "A") return true
        if (workflowName == "R") return false

        val workflow = workflows[workflowName]!!

        for (rule in workflow.rules) {
            when (rule.comparator) {
                '>' -> {
                    if (rating[rule.category]!! > rule.value) {
                        return isAccepted(rating, rule.consequence)
                    }
                }
                '<' -> {
                    if (rating[rule.category]!! < rule.value) {
                        return isAccepted(rating, rule.consequence)
                    }
                }
            }
        }

        return isAccepted(rating, workflow.default)
    }

    return ratings.sumOf { rating ->
        if (isAccepted(rating, "in")) {
            rating.values.sum()
        } else {
            0
        }
    }
}

private fun part2(input: String): Long {
    val (workflows) = parseWorkflowsAndRatings(input)

    fun countCombinations(rating: RatingRange, workflowName: String): Long {
        if (workflowName == "A") {
            return rating.values.fold(1L) { combinations, category -> combinations * (category.last - category.first + 1) }
        }
        if (workflowName == "R") return 0

        val workflow = workflows[workflowName]!!

        val nextRating = rating.toMutableMap()
        var combinations = 0L

        for (rule in workflow.rules) {
            val (trues, falses) = when (rule.comparator) {
                '>' -> (rule.value + 1)..nextRating[rule.category]!!.last to nextRating[rule.category]!!.first..rule.value
                '<' -> nextRating[rule.category]!!.first..<rule.value to rule.value..nextRating[rule.category]!!.last
                else -> throw RuntimeException()
            }

            if (!trues.isEmpty()) {
                combinations += countCombinations(nextRating.apply { put(rule.category, trues) }, rule.consequence)
            }

            if (!falses.isEmpty()) {
                nextRating[rule.category] = falses
            }
        }

        return combinations + countCombinations(nextRating, workflow.default)
    }

    return countCombinations("xmas".associate { it to 1..4000 }, "in")
}

fun main() {
    val input = readInput("Day19")
    part1(input).println()
    part2(input).println()
}
