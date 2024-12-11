defmodule Day07 do
  def part1(input) do
    equations = parse_equations(input)
    operators = [&*/2, &+/2]

    equations
    |> Enum.filter(&evaluates?(operators, &1))
    |> total_calibration_result()
  end

  def part2(input) do
    equations = parse_equations(input)
    operators = [&*/2, &+/2, &(String.to_integer("#{&1}#{&2}"))]

    equations
    |> Enum.filter(&evaluates?(operators, &1))
    |> total_calibration_result()
  end

  defp evaluates?(operators, {test_value, [initial_value | numbers]}) do
    test_value in evaluate(operators, test_value, initial_value, numbers)
  end

  defp evaluate(_operators, _test_value, value, []), do: [value]
  defp evaluate(operators, test_value, value, [number | numbers]) do
    for operator <- operators,
        result <- evaluate(operators, test_value, operator.(value, number), numbers),
        result <= test_value do
      result
    end
  end

  defp total_calibration_result(equations) do
    equations |> Enum.reduce(0, fn {test_value, _}, sum -> sum + test_value end)
  end

  defp parse_equations(input) do
    for line <- String.split(input, "\n") do
      [test_value | numbers] = ints(line)
      {test_value, numbers}
    end
  end

  defp ints(input) do
    Regex.scan(~r/-?\d+/, input)
    |> List.flatten()
    |> Enum.map(&String.to_integer/1)
  end
end

input = File.read!("day07.txt")
IO.puts(Day07.part1(input))
IO.puts(Day07.part2(input))
