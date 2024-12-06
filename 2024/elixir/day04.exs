# I wanted to play with 'for comprehensions' so shoe horned it into
# this solution any place I could find...

defmodule Day04 do
  def part1(input) do
    word_search = parse_word_search(input)

    for {position, ?X} <- word_search,
        direction <- potential_xmas_directions(position),
        Enum.map(direction, &word_search[&1]) == ~c"MAS" do
      position
    end
    |> Enum.count()
  end

  def part2(input) do
    word_search = parse_word_search(input)

    for {position, ?A} <- word_search,
        direction <- potential_mas_directions(position),
        Enum.map(direction, &word_search[&1]) == ~c"MS" do
      position
    end
    |> Enum.frequencies()
    |> Enum.count(fn {_, v} -> v == 2 end)
  end

  defp potential_xmas_directions({x, y}) do
    [
      [{x, y + 1}, {x, y + 2}, {x, y + 3}],             # N
      [{x + 1, y}, {x + 2, y}, {x + 3, y}],             # E
      [{x, y - 1}, {x, y - 2}, {x, y - 3}],             # S
      [{x - 1, y}, {x - 2, y}, {x - 3, y}],             # W
      [{x + 1, y + 1}, {x + 2, y + 2}, {x + 3, y + 3}], # NE
      [{x - 1, y + 1}, {x - 2, y + 2}, {x - 3, y + 3}], # NW
      [{x + 1, y - 1}, {x + 2, y - 2}, {x + 3, y - 3}], # SE
      [{x - 1, y - 1}, {x - 2, y - 2}, {x - 3, y - 3}]  # SW
    ]
  end

  defp potential_mas_directions({x, y}) do
    [
      # NW-SE
      [{x - 1, y + 1}, {x + 1, y - 1}],
      [{x + 1, y - 1}, {x - 1, y + 1}],
      # NE-SW
      [{x + 1, y + 1}, {x - 1, y - 1}],
      [{x - 1, y - 1}, {x + 1, y + 1}]
    ]
  end

  defp parse_word_search(input) do
    for {line, y} <- Enum.with_index(String.split(input, "\n")),
        {char, x} <- Enum.with_index(to_charlist(line)),
        into: %{} do
      {{x, y}, char}
    end
  end
end

input = File.read!("day04.txt")
IO.puts(Day04.part1(input))
IO.puts(Day04.part2(input))
