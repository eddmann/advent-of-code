#include "../shared/aoc.h"
#include "../shared/dynarray.h"
#include <stdint.h>
#include <stdlib.h>

static uint16_t *parse_measurements(const char *input) {
  uint16_t *measurements = dynarray_create(uint16_t);

  uint16_t measurement;
  size_t offset = 0, read = 0;
  while (1 == sscanf(input + offset, "%" SCNu16 "%n", &measurement, &read)) {
    dynarray_push(measurements, measurement);
    offset += read;
  }

  return measurements;
}

uint16_t day01_part1(const char *input) {
  uint16_t *measurements = parse_measurements(input);

  uint16_t increased = 0;

  for (size_t i = 0, j = 1; i < dynarray_length(measurements) - 1; i++, j++) {
    if (measurements[j] > measurements[i]) {
      increased += 1;
    }
  }

  dynarray_destroy(measurements);

  return increased;
}

uint16_t day01_part2(const char *input) {
  uint16_t *measurements = parse_measurements(input);

  uint16_t increased = 0;

  for (size_t i = 0, j = 1; i < dynarray_length(measurements) - 3; i++, j++) {
    uint16_t window_1 =
        measurements[i] + measurements[i + 1] + measurements[i + 2];
    uint16_t window_2 =
        measurements[j] + measurements[j + 1] + measurements[j + 2];
    if (window_2 > window_1) {
      increased += 1;
    }
  }

  dynarray_destroy(measurements);

  return increased;
}

AOC_MAIN(day01, 1446, 1486);
