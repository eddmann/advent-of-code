#include "../shared/aoc.h"
#include "../shared/dynarray.h"
#include <stdlib.h>

int *parse_measurements(char *input) {
  int *measurements = dynarray_create(int);

  int measurement, offset = 0, read = 0;
  while (1 == sscanf(input + offset, "%d%n", &measurement, &read)) {
    dynarray_push(measurements, measurement);
    offset += read;
  }

  return measurements;
}

int day01_part1(char *input) {
  int *measurements = parse_measurements(input);

  int increased = 0;

  for (int i = 0, j = 1; i < dynarray_length(measurements) - 1; i++, j++) {
    if (measurements[j] > measurements[i]) {
      increased += 1;
    }
  }

  dynarray_destroy(measurements);

  return increased;
}

int day01_part2(char *input) {
  int *measurements = parse_measurements(input);

  int increased = 0;

  for (int i = 0, j = 1; i < dynarray_length(measurements) - 3; i++, j++) {
    int window_1 = measurements[i] + measurements[i + 1] + measurements[i + 2];
    int window_2 = measurements[j] + measurements[j + 1] + measurements[j + 2];
    if (window_2 > window_1) {
      increased += 1;
    }
  }

  dynarray_destroy(measurements);

  return increased;
}

AOC_MAIN(day01);
