defmodule Day02 do
  def part1(input) do
    parse_reports(input)
    |> Enum.count(&is_safe?/1)
  end

  def part2(input) do
    parse_reports(input)
    |> Enum.count(fn report ->
      variants_with_level_removed = Enum.with_index(report) |> Enum.map(fn {_, index} -> List.delete_at(report, index) end)
      Enum.any?(variants_with_level_removed, &is_safe?/1)
    end)
  end

  def is_safe?(report) do
    [[level1, level2] | _] = pairs = Enum.chunk_every(report, 2, 1, :discard)
    asc? = level1 < level2

    Enum.all?(pairs, fn [level1, level2] ->
      level1 < level2 == asc? and abs(level1 - level2) in 1..3
    end)
  end

  defp parse_reports(input) do
    input
    |> String.split("\n")
    |> Enum.map(fn line ->
      String.split(line) |> Enum.map(&String.to_integer/1)
    end)
  end
end

input = File.read!("day02.txt")
IO.puts(Day02.part1(input))
IO.puts(Day02.part2(input))
