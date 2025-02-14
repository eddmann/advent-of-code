Code.require_file("./aoc.exs")

defmodule Day14 do
  @tiles_wide 101
  @tiles_tall 103

  def part1(input) do
    input
    |> parse_robots()
    |> simulate(100)
  end

  def part2(input) do
    robots = parse_robots(input)

    0..(@tiles_wide * @tiles_tall)
    |> Enum.map(fn seconds -> {simulate(robots, seconds), seconds} end)
    |> Enum.min_by(fn {safety_factor, _} -> safety_factor end)
    |> then(fn {_, seconds} -> seconds end)
  end

  defp parse_robots(input) do
    input
    |> String.split("\n", trim: true)
    |> Enum.map(&AoC.ints/1)
  end

  defp simulate(robots, seconds) do
    vm = div(@tiles_tall - 1, 2)
    hm = div(@tiles_wide - 1, 2)

    {tl, bl, tr, br} = Enum.reduce(robots, {0, 0, 0, 0}, fn [px, py, vx, vy], {tl, bl, tr, br} ->
      end_px = mod(px + vx * seconds, @tiles_wide)
      end_py = mod(py + vy * seconds, @tiles_tall)

      cond do
        end_px == hm or end_py == vm -> {tl, bl, tr, br}
        end_px < hm and end_py < vm -> {tl + 1, bl, tr, br}
        end_px < hm and end_py >= vm -> {tl, bl + 1, tr, br}
        end_px >= hm and end_py < vm -> {tl, bl, tr + 1, br}
        end_px >= hm and end_py >= vm -> {tl, bl, tr, br + 1}
      end
    end)

    tl * bl * tr * br
  end

  defp mod(a, b), do: rem(a, b) + b |> rem(b)
end

input = File.read!("day14.txt")
IO.puts(Day14.part1(input))
IO.puts(Day14.part2(input))
