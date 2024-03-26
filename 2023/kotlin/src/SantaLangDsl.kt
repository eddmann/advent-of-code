@DslMarker
annotation class SantaLangDslMarker

@SantaLangDslMarker
class NullProvider // used for Context scope

@SantaLangDslMarker
class InputProvider(private val resolver: InputResolver) {
    val input by lazy {
        resolver.invoke(NullProvider()).trimIndent()
    }
}

typealias InputResolver = NullProvider.() -> String

typealias Part = InputProvider.() -> Any

typealias PartTest = NullProvider.() -> Any

@SantaLangDslMarker
class TestProvider {
    private var input: InputProvider = InputProvider { "" }

    private var partOneTest: PartTest? = null

    private var partTwoTest: PartTest? = null

    fun input(resolver: InputResolver) {
        input = InputProvider(resolver)
    }

    fun partOne(part: PartTest) {
        partOneTest = part
    }

    fun partTwo(part: PartTest) {
        partTwoTest = part
    }

    fun execute(partOne: Part?, partTwo: Part?) {
        if (partOne != null && partOneTest != null) {
            try {
                val result = partOne.invoke(input).toString()
                val expected = partOneTest!!.invoke(NullProvider()).toString()

                if (result == expected) {
                    println("Part 1: $result \u001B[32m✔\u001B[0m")
                } else {
                    println("Part 1: $result \u001B[31m✘ (Expected: $expected)\u001B[0m")
                }
            } catch (error: Throwable) {
                println("Part 1: \u001B[31m✘ Failed with an exception\u001B[0m")
                error.cause?.printStackTrace()
            }
        }

        if (partTwo != null && partTwoTest != null) {
            try {
                val result = partTwo.invoke(input).toString()
                val expected = partTwoTest!!.invoke(NullProvider()).toString()

                if (result == expected) {
                    println("Part 2: $result \u001B[32m✔\u001B[0m")
                } else {
                    println("Part 2: $result \u001B[31m✘ (Expected: $expected)\u001B[0m")
                }
            } catch (error: Throwable) {
                println("Part 2: \u001B[31m✘ Failed with an exception\u001B[0m")
                error.cause?.printStackTrace()
            }
        }
    }
}

@SantaLangDslMarker
class Solution {
    private var input: InputProvider = InputProvider { "" }

    private var tests: List<TestProvider> = mutableListOf()

    private var partOne: Part? = null

    private var partTwo: Part? = null

    fun input(resolver: InputResolver) {
        input = InputProvider(resolver)
    }

    fun partOne(part: Part) {
        partOne = part
    }

    fun partTwo(part: Part) {
        partTwo = part
    }

    fun test(test: TestProvider.() -> Unit) {
        tests += TestProvider().apply(test)
    }

    fun execute() {
        tests.forEachIndexed { index, test ->
            println("\u001B[4mTestcase #${index + 1}\u001B[0m")
            test.execute(partOne, partTwo)
            println("")
        }

        if (partOne != null) {
            try {
                val start = System.currentTimeMillis()
                val result = partOne!!.invoke(input).toString()
                val duration = System.currentTimeMillis() - start
                println("Part 1: \u001B[32m$result\u001B[0m \u001B[90m${duration}ms\u001B[0m")
            } catch (error: Throwable) {
                println("Part 1: ✘ Failed with an exception")
                error.printStackTrace()
            }
        }

        if (partTwo != null) {
            try {
                val start = System.currentTimeMillis()
                val result = partTwo!!.invoke(input).toString()
                val duration = System.currentTimeMillis() - start
                println("Part 2: \u001B[32m$result\u001B[0m \u001B[90m${duration}ms\u001B[0m")
            } catch (error: Throwable) {
                println("Part 2: ✘ Failed with an exception")
                error.printStackTrace()
            }
        }
    }
}

fun solution(block: Solution.() -> Unit) =
    Solution().apply(block).execute()
