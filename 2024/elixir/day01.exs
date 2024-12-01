defmodule Day01 do
  def part1(input) do
    parse_input(input)
    |> Enum.map(&Enum.sort/1)
    |> Enum.zip_reduce(0, fn [left, right], acc ->
      acc + abs(left - right)
    end)
  end

  def part2(input) do
    [left, right] = parse_input(input)
    frequencies = Enum.frequencies(right)

    left
    |> Enum.map(fn value -> value * Map.get(frequencies, value, 0) end)
    |> Enum.sum()
  end

  def parse_input(input) do
    input
    |> String.split("\n")
    |> Enum.map(fn line ->
      String.split(line) |> Enum.map(&String.to_integer/1)
    end)
    |> Enum.zip()
    |> Enum.map(&Tuple.to_list/1)
  end
end

input = File.read!("day01.txt")
IO.puts(Day01.part1(input))
IO.puts(Day01.part2(input))
