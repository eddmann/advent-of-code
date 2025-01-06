defmodule Day12 do
  def part1(input) do
    input
    |> parse_map()
    |> regions()
    |> Enum.map(fn region -> area(region) * perimeter(region) end)
    |> Enum.sum()
  end

  def part2(input) do
    input
    |> parse_map()
    |> regions()
    |> Enum.map(fn region -> area(region) * sides(region) end)
    |> Enum.sum()
  end

  defp regions(map), do: regions(map, Map.keys(map), MapSet.new([]), [])
  defp regions(_map, [], _seen, regions), do: regions
  defp regions(map, [current | queue], seen, regions) do
    if MapSet.member?(seen, current) do
      regions(map, queue, seen, regions)
    else
      region = region(map, seen, current)
      regions(map, queue, MapSet.union(seen, region), [region | regions])
    end
  end

  defp region(map, seen, current), do: region(map, Map.get(map, current), [current], seen, [current])
  defp region(_map, _plant, [], _seen, region), do: MapSet.new(region)
  defp region(map, plant, [current | queue], seen, region) do
    neighbours = potential_neighbours(current)
    |> Enum.filter(&(Map.get(map, &1) == plant and not MapSet.member?(seen, &1)))

    region(map, plant, queue ++ neighbours, MapSet.union(seen, MapSet.new(neighbours)), region ++ neighbours)
  end

  defp potential_neighbours({x, y}) do
    for {dx, dy} <- [{-1, 0}, {1, 0}, {0, -1}, {0, 1}] do
      {x + dx, y + dy}
    end
  end

  defp area(region) do
    Enum.count(region)
  end

  defp perimeter(region) do
    region
    |> Enum.flat_map(&potential_neighbours/1)
    |> Enum.count(&(&1 not in region))
  end

  defp sides(region) do
    region
    |> Enum.map(fn {x, y} ->
      Enum.count([{-1, 1}, {1, 1}, {1, -1}, {-1, -1}], fn {dx, dy} ->
        xn = {x + dx, y}
        yn = {x, y + dy}
        dn = {x + dx, y + dy}
        (xn not in region and yn not in region) or (xn in region and yn in region and dn not in region)
      end)
    end)
    |> Enum.sum()
  end

  defp parse_map(input) do
    for {line, y} <- Enum.with_index(String.split(input, "\n")),
        {value, x} <- Enum.with_index(String.split(line, "", trim: true)),
        into: %{} do
      {{x, y}, value}
    end
  end
end

input = File.read!("day12.txt")
IO.puts(Day12.part1(input))
IO.puts(Day12.part2(input))
