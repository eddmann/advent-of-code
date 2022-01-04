#include "../shared/aoc.h"

#define GRID_SIZE 100

typedef struct {
  uint32_t risk, point;
} r_point_t;

typedef struct {
  r_point_t *points;
  uint32_t length, size;
} point_heap_t;

static void point_heap_push(point_heap_t *heap, uint32_t risk, uint32_t point) {
  if (heap->length + 1 >= heap->size) {
    heap->size = heap->size ? heap->size * 2 : 4;
    heap->points =
        (r_point_t *)realloc(heap->points, heap->size * sizeof(r_point_t));
  }

  uint32_t i = heap->length + 1;
  uint32_t j = i / 2;

  while (i > 1 && heap->points[j].risk > risk) {
    heap->points[i] = heap->points[j];
    i = j;
    j = j / 2;
  }

  heap->points[i].risk = risk;
  heap->points[i].point = point;
  heap->length++;
}

static uint32_t point_heap_pop(point_heap_t *heap) {
  uint32_t point = heap->points[1].point;

  heap->points[1] = heap->points[heap->length];
  heap->length--;

  uint32_t i = 1;
  while (i != heap->length + 1) {
    uint32_t k = heap->length + 1;
    uint32_t j = 2 * i;
    if (j <= heap->length && heap->points[j].risk < heap->points[k].risk)
      k = j;
    if (j + 1 <= heap->length &&
        heap->points[j + 1].risk < heap->points[k].risk)
      k = j + 1;
    heap->points[i] = heap->points[k];
    i = k;
  }

  return point;
}

static uint8_t risk_level(uint8_t grid[GRID_SIZE * GRID_SIZE], uint32_t x,
                          uint32_t y) {
  uint8_t risk = ((x / GRID_SIZE) + (y / GRID_SIZE) +
                  grid[(x % GRID_SIZE) * GRID_SIZE + (y % GRID_SIZE)]) %
                 9;
  return risk == 0 ? 9 : risk;
}

static uint32_t calc_lowest_risk(const char *input, uint8_t scale) {
  uint8_t grid[GRID_SIZE * GRID_SIZE];

  size_t input_idx = 0;
  for (size_t x = 0; x < GRID_SIZE; x++) {
    for (size_t y = 0; y < GRID_SIZE; y++) {
      grid[x * GRID_SIZE + y] = input[input_idx++] - '0';
    }
    input_idx++;
  }

  uint32_t risk_levels[(GRID_SIZE * scale) * (GRID_SIZE * scale)];
  memset(risk_levels, 0, sizeof(risk_levels));

  point_heap_t *heap = (point_heap_t *)calloc(1, sizeof(point_heap_t));
  point_heap_push(heap, 0, 0);

  while (heap->length > 0) {
    uint32_t point = point_heap_pop(heap);
    uint32_t risk = risk_levels[point];

    for (int8_t dx = -1; dx <= 1; dx++) {
      for (int8_t dy = -1; dy <= 1; dy++) {
        if (dx != 0 && dy != 0)
          continue;
        if (dx == 0 && dy == 0)
          continue;

        uint32_t next_x = point / (GRID_SIZE * scale) + dx;
        uint32_t next_y = point % (GRID_SIZE * scale) + dy;

        if (next_x >= 0 && next_x < (GRID_SIZE * scale) && next_y >= 0 &&
            next_y < (GRID_SIZE * scale)) {
          uint32_t next_point = next_x * (GRID_SIZE * scale) + next_y;

          if (risk_levels[next_point] == 0) {
            uint32_t next_risk = risk + risk_level(grid, next_x, next_y);
            risk_levels[next_point] = next_risk;
            point_heap_push(heap, next_risk, next_point);
          }
        }
      }
    }
  }

  free(heap);

  return risk_levels[(GRID_SIZE * scale) * (GRID_SIZE * scale) - 1];
}

static uint64_t part1(const char *input) { return calc_lowest_risk(input, 1); }

static uint64_t part2(const char *input) { return calc_lowest_risk(input, 5); }

AOC_MAIN(day15, 811, 3012);
