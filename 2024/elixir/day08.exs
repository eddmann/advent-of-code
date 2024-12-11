defmodule Day08 do
  def part1(input) do
    input
    |> parse_map()
    |> unique_antinode_locations(&model_one/3)
    |> Enum.count()
  end

  def part2(input) do
    input
    |> parse_map()
    |> unique_antinode_locations(&model_two/3)
    |> Enum.count()
  end

  defp model_one(map, {ax, ay}, {bx, by}) do
    dx = bx - ax
    dy = by - ay

    [{ax - dx, ay - dy}, {bx + dx, by + dy}]
    |> Enum.filter(&Map.get(map, &1))
  end

  defp model_two(map, {ax, ay}, {bx, by}) do
    dx = bx - ax
    dy = by - ay

    as = infinite_stream(0)
    |> Stream.map(&({ax - dx * &1, ay - dy * &1}))
    |> Stream.take_while(&Map.get(map, &1))

    bs = infinite_stream(0)
    |> Stream.map(&({bx + dx * &1, by + dy * &1}))
    |> Stream.take_while(&Map.get(map, &1))

    Enum.concat(as, bs)
  end

  defp parse_map(input) do
    for {line, y} <- Enum.with_index(String.split(input, "\n")),
        {char, x} <- Enum.with_index(to_charlist(line)),
        into: %{} do
      {{x, y}, char}
    end
  end

  defp antenna_frequencies(map) do
    map
    |> Enum.group_by(&(elem(&1, 1)), &(elem(&1, 0)))
    |> Map.drop(~c".")
  end

  defp unique_antinode_locations(map, model) do
    for {_, locations} <- antenna_frequencies(map),
        a <- locations, b <- locations, a != b,
        antinode <- model.(map, a, b),
        into: MapSet.new() do
      antinode
    end
  end

  defp infinite_stream(start=0) do
    Stream.unfold(start, &({&1, &1 + 1}))
  end
end

input = File.read!("day08.txt")
IO.puts(Day08.part1(input))
IO.puts(Day08.part2(input))
