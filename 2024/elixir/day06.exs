defmodule Day06 do
  def part1(input) do
    lab = parse_lab(input)
    start = start_position(lab)

    patrol_path(lab, start) |> Enum.count()
  end

  def part2_sync(input) do
    lab = parse_lab(input)
    start = start_position(lab)

    for {position, char} <- lab, char == ?. do
      position
    end
    |> Enum.map(&patrol_path(Map.put(lab, &1, ?#), start))
    |> Enum.count(&(&1== :cycle))
  end

  def part2_async(input) do
    lab = parse_lab(input)
    start = start_position(lab)

    for {position, char} <- lab, char == ?. do
      position
    end
    |> Task.async_stream(&patrol_path(Map.put(lab, &1, ?#), start))
    |> Enum.count(fn {:ok, path} -> path == :cycle end)
  end

  defp parse_lab(input) do
    for {line, y} <- Enum.with_index(String.split(input, "\n")),
        {char, x} <- Enum.with_index(to_charlist(line)),
        into: %{} do
      {{x, y}, char}
    end
  end

  defp start_position(map) do
    {position, _} = Enum.find(map, fn {_, char} -> char == ?^ end)
    position
  end

  defp patrol_path(lab, position) do
    patrol_path(lab, position, {0, -1}, MapSet.new([{position, {0, -1}}]))
  end

  defp patrol_path(lab, {x, y} = position, {dx, dy} = direction, path) do
    next_position = {x + dx, y + dy}

    case Map.get(lab, next_position) do
      ?# -> patrol_path(lab, position, {-dy, dx}, path)
      nil -> path |> Enum.map(fn {position, _} -> position end) |> Enum.uniq()
      _ ->
        if MapSet.member?(path, {next_position, direction}) do
          :cycle
        else
          patrol_path(lab, next_position, direction, MapSet.put(path, {next_position, direction}))
        end
    end
  end
end

input = File.read!("day06.txt")
IO.puts(Day06.part1(input))
IO.puts(Day06.part2_async(input))
