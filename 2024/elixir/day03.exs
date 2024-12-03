defmodule Day03 do
  def part1(input) do
    input
    |> parse_memory()
    |> Enum.map(fn
      {:mul, a, b} -> a * b
      _ -> 0
    end)
    |> Enum.sum()
  end

  def part2(input) do
    input
    |> parse_memory()
    |> Enum.reduce({:do, 0}, fn
      {:mul, a, b}, {action, sum} when action == :do -> {action, sum + a * b}
      {action}, {_, sum} -> {action, sum}
      _, acc -> acc
    end)
    |> then(fn {_, sum} -> sum end)
  end

  defp parse_memory(input) do
    Regex.scan(~r/(mul\((\d+),(\d+)\)|do\(\)|don't\(\))/, input)
    |> Enum.map(fn
      [_, _, a, b] -> {:mul, String.to_integer(a), String.to_integer(b)}
      ["do()", _] -> {:do}
      ["don't()", _] -> {:dont}
    end)
  end
end

input = File.read!("day03.txt")
IO.puts(Day03.part1(input))
IO.puts(Day03.part2(input))
