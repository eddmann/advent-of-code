Code.require_file("./aoc.exs")
Mix.install([
  {:memoize, "~> 1.4"}
])

defmodule Day11 do
  use Memoize

  def part1(input) do
    input
    |> AoC.ints()
    |> Enum.map(&count(&1, 25))
    |> Enum.sum()
  end

  def part2(input) do
    input
    |> AoC.ints()
    |> Enum.map(&count(&1, 75))
    |> Enum.sum()
  end

  defmemo count(_stone, 0), do: 1
  defmemo count(0, blinks), do: count(1, blinks - 1)
  defmemo count(stone, blinks) do
    string = Integer.to_string(stone)
    length = String.length(string)
    if rem(length, 2) === 0 do
      {left, right} = String.split_at(string, div(length, 2))
      count(String.to_integer(left), blinks - 1) + count(String.to_integer(right), blinks - 1)
    else
      count(stone * 2024, blinks - 1)
    end
  end
end

input = File.read!("day11.txt")
IO.puts(Day11.part1(input))
IO.puts(Day11.part2(input))
