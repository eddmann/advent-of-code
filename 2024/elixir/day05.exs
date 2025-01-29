Code.require_file("./aoc.exs")

defmodule Day05 do
  def part1(input) do
    [rules, updates] = parse_rules_and_updates(input)

    updates
    |> Enum.filter(&(correct_order(rules, &1) == &1))
    |> Enum.map(&middle_value/1)
    |> Enum.sum()
  end

  def part2(input) do
    [rules, updates] = parse_rules_and_updates(input)

    updates
    |> Enum.filter(&(correct_order(rules, &1) != &1))
    |> Enum.map(&middle_value(correct_order(rules, &1)))
    |> Enum.sum()
  end

  defp parse_rules_and_updates(input) do
    String.split(input, "\n\n")
    |> Enum.map(fn section ->
      String.split(section, "\n") |> Enum.map(&AoC.ints/1)
    end)
  end

  defp middle_value(update) do
    middle_index = div(length(update), 2)
    Enum.at(update, middle_index)
  end

  defp correct_order(rules, update) do
    graph = :digraph.new

    for [before, after_] <- rules,
        before in update and after_ in update
    do
      :digraph.add_vertex(graph, before)
      :digraph.add_vertex(graph, after_)
      :digraph.add_edge(graph, before, after_)
    end

    :digraph_utils.topsort(graph)
  end
end

input = File.read!("day05.txt")
IO.puts(Day05.part1(input))
IO.puts(Day05.part2(input))
