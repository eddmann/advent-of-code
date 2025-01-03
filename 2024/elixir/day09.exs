defmodule Day09 do
  def part1(input) do
    input
    |> parse_blocks()
    |> uncompress()
    |> compact()
    |> checksum_blocks()
  end

  def part2(input) do
    input
    |> parse_blocks()
    |> extract_gaps_and_files()
    |> fill_gaps_with_files()
    |> checksum_files()
  end

  defp parse_blocks(input) do
    input
    |> String.split("", trim: true)
    |> Enum.map(&String.to_integer/1)
    |> Enum.chunk_every(2, 2, [0])
  end

  defp uncompress(blocks) do
    blocks
    |> Enum.with_index()
    |> Enum.flat_map(fn {[size, gap], file_id} ->
      List.duplicate(file_id, size) ++ List.duplicate(nil, gap)
    end)
    |> Enum.with_index()
    |> Map.new(fn {block, index} -> {index, block} end)
  end

  defp compact(blocks), do: compact(blocks, 0, Map.keys(blocks) |> Enum.max())
  defp compact(blocks, left, right) when left >= right, do: blocks
  defp compact(blocks, left, right) do
    case {Map.get(blocks, left), Map.get(blocks, right)} do
      {nil, nil} -> compact(blocks, left, right - 1)
      {nil, file_id} -> compact(Map.put(blocks, left, file_id) |> Map.put(right, nil), left + 1, right - 1)
      _ -> compact(blocks, left + 1, right)
    end
  end

  defp checksum_blocks(uncompressed_blocks) do
    uncompressed_blocks
    |> Enum.reduce(0, fn
      {_, nil}, sum -> sum
      {index, block}, sum -> sum + (index * block)
    end)
  end

  defp extract_gaps_and_files(blocks) do
    blocks
    |> Enum.with_index()
    |> Enum.reduce({[], [], 0}, fn {[file_size, gap_size], file_id}, {gaps, files, index} ->
      gaps = if gap_size > 0, do: [{gap_size, index + file_size} | gaps], else: gaps
      files = [{index, {file_id, file_size}} | files]
      {gaps, files, index + file_size + gap_size}
    end)
    |> then(fn {gaps, files, _} -> {Enum.reverse(gaps), files} end)
  end

  defp fill_gaps_with_files({_, []}), do: []
  defp fill_gaps_with_files({gaps, [{file_index, {file_id, file_size}} = file | files]}) do
    case Enum.find_index(gaps, fn
      {gap_size, gap_index} -> gap_size >= file_size and gap_index < file_index
    end) do
      nil ->
        [file | fill_gaps_with_files({gaps, files})]
      candidate ->
        {gap_size, gap_index} = Enum.at(gaps, candidate)
        updated_gaps =
          case gap_size do
            ^file_size -> List.delete_at(gaps, candidate)
            _ -> List.replace_at(gaps, candidate, {gap_size - file_size, gap_index + file_size})
          end
        [{gap_index, {file_id, file_size}} | fill_gaps_with_files({updated_gaps, files})]
    end
  end

  defp checksum_files(files) do
    files
    |> Enum.flat_map(fn {file_index, {file_id, file_size}} ->
      Enum.map(0..(file_size - 1), fn offset -> (file_index + offset) * file_id end)
    end)
    |> Enum.sum()
  end
end

input = File.read!("day09.txt")
IO.puts(Day09.part1(input))
IO.puts(Day09.part2(input))
