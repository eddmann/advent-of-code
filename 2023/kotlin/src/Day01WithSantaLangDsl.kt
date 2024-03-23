fun main() = solution {
    fun calibrate(values: List<String>) = values.sumOf { value ->
        val digits = value.replace(Regex("\\D"), "")
        "${digits.first()}${digits.last()}".toInt()
    }

    input {
        readInput("Day01")
    }

    partOne {
        calibrate(input.lines())
    }

    partTwo {
        val translations = mapOf(
            "one" to "o1e",
            "two" to "t2o",
            "three" to "t3e",
            "four" to "4",
            "five" to "5e",
            "six" to "6",
            "seven" to "7n",
            "eight" to "e8t",
            "nine" to "n9e",
        )

        val values = input.lines().map { value ->
            translations.entries.fold(value) { acc, (from, to) ->
                acc.replace(from, to)
            }
        }

        calibrate(values)
    }

    test {
        input {
            """
            1abc2
            pqr3stu8vwx
            a1b2c3d4e5f
            treb7uchet
            """
        }
        partOne {
            142
        }
    }

    test {
        input {
            """
            two1nine
            eightwothree
            abcone2threexyz
            xtwone3four
            4nineeightseven2
            zoneight234
            7pqrstsixteen
            """
        }
        partTwo {
            281
        }
    }
}
