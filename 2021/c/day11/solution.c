#include "../shared/aoc.h"
#include <stdbool.h>
#include <stdint.h>
#include <stdlib.h>

#define GRID_SIZE 10
#define MAX_ENERGY_LEVEL 9

uint8_t **build_octopus_grid(const char *input) {
  uint8_t *rows = calloc(GRID_SIZE * GRID_SIZE, sizeof(uint8_t));
  uint8_t **grid = malloc(GRID_SIZE * sizeof(uint8_t *));

  for (size_t i = 0; i < GRID_SIZE; i++)
    grid[i] = rows + i * GRID_SIZE;

  size_t pos = 0;
  for (size_t x = 0; x < GRID_SIZE; x++) {
    for (size_t y = 0; y < GRID_SIZE; y++)
      grid[x][y] = (uint8_t)input[pos++] - '0';
    pos += 1;
  }

  return grid;
}

void step(uint8_t **grid) {
  for (size_t i = 0; i < GRID_SIZE * GRID_SIZE; i++)
    (*grid)[i] += 1;

  bool ripple = true;
  while (ripple) {
    ripple = false;

    for (uint8_t x = 0; x < GRID_SIZE; x++) {
      for (uint8_t y = 0; y < GRID_SIZE; y++) {
        if (grid[x][y] <= MAX_ENERGY_LEVEL)
          continue;

        grid[x][y] = 0;

        for (int8_t dx = -1; dx <= 1; dx++) {
          for (int8_t dy = -1; dy <= 1; dy++) {
            int nx = x - dx;
            int ny = y - dy;

            if (nx < 0 || nx > GRID_SIZE - 1 || ny < 0 || ny > GRID_SIZE - 1)
              continue;
            if (grid[nx][ny] == 0)
              continue;

            grid[nx][ny] += 1;

            if (grid[nx][ny] > MAX_ENERGY_LEVEL)
              ripple = true;
          }
        }
      }
    }
  }
}

uint16_t day11_part1(const char *input) {
  uint8_t **grid = build_octopus_grid(input);

  uint16_t total_flashes = 0;

  for (uint8_t i = 0; i < 100; i++) {
    step(grid);

    for (size_t i = 0; i < (GRID_SIZE * GRID_SIZE); i++)
      total_flashes += (*grid)[i] == 0;
  }

  free(*grid);
  free(grid);

  return total_flashes;
}

uint16_t day11_part2(const char *input) {
  uint8_t **grid = build_octopus_grid(input);

  uint16_t total_steps = 0;

  bool next_step = true;
  while (next_step) {
    next_step = false;

    step(grid);
    total_steps += 1;

    for (size_t i = 0; i < GRID_SIZE * GRID_SIZE; i++) {
      if ((*grid)[i] != 0) {
        next_step = true;
        break;
      }
    }
  }

  return total_steps;
}

AOC_MAIN(day11, 1647, 348);
