#include "../shared/aoc.h"
#include "../shared/dynarray.h"
#include <stdbool.h>
#include <stdint.h>
#include <stdlib.h>

#define GRID_SIZE 100
#define MAX_HEIGHT 9

typedef struct Point {
  int x;
  int y;
} point_t;

static uint8_t **parse_heightmap(const char *input) {
  uint8_t *rows = calloc((GRID_SIZE + 2) * (GRID_SIZE + 2), sizeof(uint8_t));
  uint8_t **heightmap = malloc((GRID_SIZE + 2) * sizeof(uint8_t *));
  for (size_t i = 0; i < GRID_SIZE + 2; i++) {
    heightmap[i] = rows + i * (GRID_SIZE + 2);
  }

  int pos = 0;
  for (size_t x = 1; x <= GRID_SIZE; x++) {
    for (size_t y = 1; y <= GRID_SIZE; y++) {
      heightmap[x][y] = input[pos++] - '0';
    }
    pos++;
  }

  for (size_t i = 0; i < GRID_SIZE + 2; i++) {
    heightmap[i][0] = heightmap[0][i] = heightmap[i][GRID_SIZE + 1] =
        heightmap[GRID_SIZE + 1][i] = MAX_HEIGHT;
  }

  return heightmap;
}

static point_t *find_low_points(uint8_t **heightmap) {
  point_t *low_points = dynarray_create(point_t);

  for (size_t x = 1; x <= GRID_SIZE; x++) {
    for (size_t y = 1; y <= GRID_SIZE; y++) {
      if (heightmap[x][y] < heightmap[x - 1][y] &&
          heightmap[x][y] < heightmap[x][y - 1] &&
          heightmap[x][y] < heightmap[x + 1][y] &&
          heightmap[x][y] < heightmap[x][y + 1]) {
        point_t point = {.x = x, .y = y};
        dynarray_push(low_points, point);
      }
    }
  }

  return low_points;
}

static uint32_t calc_basin_size(uint8_t **heightmap, point_t start) {
  bool *rows = calloc((GRID_SIZE + 2) * (GRID_SIZE + 2), sizeof(bool));
  bool **visited = malloc((GRID_SIZE + 2) * sizeof(bool *));
  for (size_t i = 0; i < GRID_SIZE + 2; i++) {
    visited[i] = rows + i * (GRID_SIZE + 2);
  }

  point_t *stack = dynarray_create(point_t);
  dynarray_push(stack, start);

  uint32_t size = 0;

  while (dynarray_length(stack) > 0) {
    point_t point;
    dynarray_pop(stack, &point);

    if (heightmap[point.x][point.y] == MAX_HEIGHT ||
        visited[point.x][point.y]) {
      continue;
    }

    visited[point.x][point.y] = true;
    size += 1;

    point_t up = {.x = point.x - 1, .y = point.y};
    dynarray_push(stack, up);
    point_t down = {.x = point.x + 1, .y = point.y};
    dynarray_push(stack, down);
    point_t left = {.x = point.x, .y = point.y - 1};
    dynarray_push(stack, left);
    point_t right = {.x = point.x, .y = point.y + 1};
    dynarray_push(stack, right);
  }

  dynarray_destroy(stack);
  free(*visited);
  free(visited);

  return size;
}

static int cmp_descending(const void *a, const void *b) {
  return *(int *)b - *(int *)a;
}

uint32_t day09_part1(const char *input) {
  uint8_t **heightmap = parse_heightmap(input);
  point_t *low_points = find_low_points(heightmap);

  uint32_t sum = 0;

  for (size_t i = 0; i < dynarray_length(low_points); i++) {
    point_t low_point = low_points[i];
    sum += heightmap[low_point.x][low_point.y] + 1;
  }

  dynarray_destroy(low_points);
  free(*heightmap);
  free(heightmap);

  return sum;
}

uint32_t day09_part2(const char *input) {
  uint8_t **heightmap = parse_heightmap(input);
  point_t *low_points = find_low_points(heightmap);
  uint32_t *basins = dynarray_create(uint32_t);

  for (size_t i = 0; i < dynarray_length(low_points); i++) {
    uint32_t size = calc_basin_size(heightmap, low_points[i]);
    dynarray_push(basins, size);
  }

  qsort(basins, dynarray_length(basins), sizeof(uint32_t), cmp_descending);

  dynarray_destroy(low_points);
  free(*heightmap);
  free(heightmap);

  return basins[0] * basins[1] * basins[2];
}

AOC_MAIN(day09, 588, 964712);
