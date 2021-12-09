#include "../shared/aoc.h"
#include "../shared/dynarray.h"
#include <stdbool.h>
#include <stdlib.h>

#define GRID_SIZE 100
#define MAX_HEIGHT 9

typedef struct {
  int x;
  int y;
} Point;

int **parse_heightmap(char *input) {
  int *rows = calloc((GRID_SIZE + 2) * (GRID_SIZE + 2), sizeof(int));
  int **heightmap = malloc((GRID_SIZE + 2) * sizeof(int *));
  for (int i = 0; i < GRID_SIZE + 2; i++) {
    heightmap[i] = rows + i * (GRID_SIZE + 2);
  }

  int pos = 0;
  for (int x = 1; x <= GRID_SIZE; x++) {
    for (int y = 1; y <= GRID_SIZE; y++) {
      heightmap[x][y] = input[pos++] - '0';
    }
    pos++;
  }

  for (int i = 0; i < GRID_SIZE + 2; i++) {
    heightmap[i][0] = heightmap[0][i] = heightmap[i][GRID_SIZE + 1] =
        heightmap[GRID_SIZE + 1][i] = MAX_HEIGHT;
  }

  return heightmap;
}

Point *find_low_points(int **heightmap) {
  Point *low_points = dynarray_create(Point);

  for (int x = 1; x <= GRID_SIZE; x++) {
    for (int y = 1; y <= GRID_SIZE; y++) {
      if (heightmap[x][y] < heightmap[x - 1][y] &&
          heightmap[x][y] < heightmap[x][y - 1] &&
          heightmap[x][y] < heightmap[x + 1][y] &&
          heightmap[x][y] < heightmap[x][y + 1]) {
        Point point = {.x = x, .y = y};
        dynarray_push(low_points, point);
      }
    }
  }

  return low_points;
}

int calc_basin_size(int **heightmap, Point start) {
  bool *rows = calloc((GRID_SIZE + 2) * (GRID_SIZE + 2), sizeof(bool));
  bool **visited = malloc((GRID_SIZE + 2) * sizeof(bool *));
  for (int i = 0; i < GRID_SIZE + 2; i++) {
    visited[i] = rows + i * (GRID_SIZE + 2);
  }

  Point *stack = dynarray_create(Point);
  dynarray_push(stack, start);

  int size = 0;

  while (dynarray_length(stack) > 0) {
    Point point;
    dynarray_pop(stack, &point);

    if (heightmap[point.x][point.y] == MAX_HEIGHT ||
        visited[point.x][point.y]) {
      continue;
    }

    visited[point.x][point.y] = true;
    size += 1;

    Point up = {.x = point.x - 1, .y = point.y};
    dynarray_push(stack, up);
    Point down = {.x = point.x + 1, .y = point.y};
    dynarray_push(stack, down);
    Point left = {.x = point.x, .y = point.y - 1};
    dynarray_push(stack, left);
    Point right = {.x = point.x, .y = point.y + 1};
    dynarray_push(stack, right);
  }

  dynarray_destroy(stack);
  free(*visited);
  free(visited);

  return size;
}

int cmp_descending(const void *a, const void *b) {
  return *(int *)b - *(int *)a;
}

int day09_part1(char *input) {
  int **heightmap = parse_heightmap(input);
  Point *low_points = find_low_points(heightmap);

  int sum = 0;
  for (int i = 0; i < dynarray_length(low_points); i++) {
    Point low_point = low_points[i];
    sum += heightmap[low_point.x][low_point.y] + 1;
  }

  dynarray_destroy(low_points);
  free(*heightmap);
  free(heightmap);

  return sum;
}

int day09_part2(char *input) {
  int **heightmap = parse_heightmap(input);
  Point *low_points = find_low_points(heightmap);
  int *basins = dynarray_create(int);

  for (int i = 0; i < dynarray_length(low_points); i++) {
    int size = calc_basin_size(heightmap, low_points[i]);
    dynarray_push(basins, size);
  }

  qsort(basins, dynarray_length(basins), sizeof(int), cmp_descending);

  dynarray_destroy(low_points);
  free(*heightmap);
  free(heightmap);

  return basins[0] * basins[1] * basins[2];
}

AOC_MAIN(day09);
