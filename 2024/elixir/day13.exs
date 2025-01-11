defmodule Day13 do
  def part1(input) do
    input
    |> parse_machines()
    |> Enum.map(fn [ax, ay, bx, by, px, py] ->
      for a <- 1..100, b <- 1..100, ax * a + bx * b == px and ay * a + by * b == py do
        a * 3 + b
      end
      |> Enum.min(fn -> 0 end)
    end)
    |> Enum.sum()
  end

  # 🙏 https://www.youtube.com/watch?v=-5J-DAsWuJc
  def part2(input) do
    input
    |> parse_machines()
    |> Enum.map(fn [ax, ay, bx, by, px, py] ->
      px = px + 10000000000000
      py = py + 10000000000000
      ca = (px * by - py * bx) / (ax * by - ay * bx)
      cb = (px - ax * ca) / bx
      if ca == trunc(ca) and cb == trunc(cb), do: trunc(ca * 3 + cb), else: 0
    end)
    |> Enum.sum()
  end

  defp parse_machines(input) do
    input
    |> String.split("\n\n")
    |> Enum.map(&ints/1)
  end

  defp ints(input) do
    Regex.scan(~r/-?\d+/, input)
    |> List.flatten()
    |> Enum.map(&String.to_integer/1)
  end
end

input = File.read!("day13.txt")
IO.puts(Day13.part1(input))
IO.puts(Day13.part2(input))
