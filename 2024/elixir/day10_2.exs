defmodule Day10 do
  def part1(input) do
    map = parse_topographic_map(input)

    for {position, height} <- map, height == 0 do
      score(map, :queue.in(position, :queue.new()), MapSet.new([position]), 0)
    end
    |> Enum.sum()
  end

  def part2(input) do
    map = parse_topographic_map(input)

    for {position, height} <- map, height == 0 do
      rating(map, :queue.in(position, :queue.new()), %{position => 1}, 0)
    end
    |> Enum.sum()
  end

  defp potential_neighbours({x, y}) do
    for {dx, dy} <- [{-1, 0}, {1, 0}, {0, -1}, {0, 1}] do
      {x + dx, y + dy}
    end
  end

  defp score(map, queue, seen, score) do
    case :queue.out(queue) do
      {:empty, _} -> score
      {{:value, current}, queue} ->
        case Map.get(map, current) do
          9 ->
            score(map, queue, seen, score + 1)

          height ->
            next_positions =
              potential_neighbours(current)
              |> Enum.filter(fn position ->
                Map.get(map, position) == height + 1 and not MapSet.member?(seen, position)
              end)

            next_seen = MapSet.union(seen, MapSet.new(next_positions))
            next_queue = Enum.reduce(next_positions, queue, &:queue.in(&1, &2))

            score(map, next_queue, next_seen, score)
        end
    end
  end

  defp rating(map, queue, seen, rating) do
    case :queue.out(queue) do
      {:empty, _} -> rating
      {{:value, current}, queue} ->
        case Map.get(map, current) do
          9 ->
            rating(map, queue, seen, rating + Map.get(seen, current))

          height ->
            next_positions =
              potential_neighbours(current)
              |> Enum.filter(fn position -> Map.get(map, position) == height + 1 end)

            next_seen =
              Enum.reduce(next_positions, seen, fn position, acc ->
                Map.update(acc, position, Map.get(seen, current), &(&1 + Map.get(seen, current)))
              end)

            next_queue =
              Enum.reduce(Enum.reject(next_positions, &Map.has_key?(seen, &1)), queue, &:queue.in(&1, &2))

            rating(map, next_queue, next_seen, rating)
        end
    end
  end

  defp parse_topographic_map(input) do
    for {line, y} <- Enum.with_index(String.split(input, "\n")),
        {height, x} <- Enum.with_index(String.split(line, "", trim: true)),
        into: %{} do
      {{x, y}, String.to_integer(height)}
    end
  end
end

input = File.read!("day10.txt")
IO.puts(Day10.part1(input))
IO.puts(Day10.part2(input))
