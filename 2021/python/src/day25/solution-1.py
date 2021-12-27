from itertools import count


def part1(input):
    grid = input.splitlines()

    height, width = len(grid), len(grid[0])

    cucumbers = {(x, y): el
                 for y, row in enumerate(grid)
                 for x, el in enumerate(row)
                 if el != '.'}

    for step in count(1):
        move_east = {pos if el == '>' and (pos := ((x + 1) % width, y)) not in cucumbers else (x, y): el
                     for (x, y), el in cucumbers.items()}

        move_south = {pos if el == 'v' and (pos := (x, (y + 1) % height)) not in move_east else (x, y): el
                      for (x, y), el in move_east.items()}

        if move_south == cucumbers:
            return step

        cucumbers = move_south
