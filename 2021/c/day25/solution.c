#include "../shared/aoc.h"

#define MAX_SIZE 150

static uint64_t part1(const char *input) {
  char cucumbers[MAX_SIZE][MAX_SIZE];
  uint16_t width = 0, height = 0;

  uint32_t offset = 0, read = 0;
  while (1 == sscanf(input + offset, "%s\n%n", cucumbers[height], &read)) {
    height += 1;
    offset += read;
  }
  width = strlen(cucumbers[0]);

  bool has_moved = true;
  uint16_t total_steps = 0;

  while (has_moved) {
    total_steps += 1;
    has_moved = false;

    for (uint16_t y = 0; y < height; y++) {
      bool has_wrap = cucumbers[y][width - 1] == '>' && cucumbers[y][0] == '.';

      for (uint16_t x = 0; x < width - 1; x++) {
        if (cucumbers[y][x] == '>' && cucumbers[y][x + 1] == '.') {
          cucumbers[y][x] = '.';
          cucumbers[y][x + 1] = '>';
          has_moved = true;
          x += 1;
        }
      }

      if (has_wrap) {
        cucumbers[y][width - 1] = '.';
        cucumbers[y][0] = '>';
        has_moved = true;
      }
    }

    for (uint16_t x = 0; x < width; x++) {
      bool has_wrap = cucumbers[height - 1][x] == 'v' && cucumbers[0][x] == '.';

      for (uint16_t y = 0; y < height - 1; y++) {
        if (cucumbers[y][x] == 'v' && cucumbers[y + 1][x] == '.') {
          cucumbers[y][x] = '.';
          cucumbers[y + 1][x] = 'v';
          has_moved = true;
          y += 1;
        }
      }

      if (has_wrap) {
        cucumbers[height - 1][x] = '.';
        cucumbers[0][x] = 'v';
        has_moved = true;
      }
    }
  }

  return total_steps;
}

static uint64_t part2(const char *input) { return 0; }

AOC_MAIN(day25, 412, 0);
