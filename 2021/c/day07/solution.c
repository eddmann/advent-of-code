#include "../shared/aoc.h"
#include "../shared/dynarray.h"
#include <limits.h>
#include <stdbool.h>
#include <stdlib.h>

#define max(a, b)                                                              \
  ({                                                                           \
    __typeof__(a) _a = (a);                                                    \
    __typeof__(b) _b = (b);                                                    \
    _a > _b ? _a : _b;                                                         \
  })
#define min(a, b)                                                              \
  ({                                                                           \
    __typeof__(a) _a = (a);                                                    \
    __typeof__(b) _b = (b);                                                    \
    _a < _b ? _a : _b;                                                         \
  })

int *parse_crab_positions(char *input) {
  int *crabs = dynarray_create(int);

  int crab, offset = 0, read = 0;
  while (1 == sscanf(input + offset, "%d,%n", &crab, &read)) {
    dynarray_push(crabs, crab);
    offset += read;
  }

  return crabs;
}

int max_crab_position(int *crabs) {
  int position = INT_MIN;

  for (int i = 0; i < dynarray_length(crabs); i++) {
    position = max(position, crabs[i]);
  }

  return position;
}

int calc_fuel_burnt(int *crabs, int position, bool is_constant_rate) {
  int fuel = 0;

  for (int i = 0; i < dynarray_length(crabs); i++) {
    int burnt = abs(crabs[i] - position);
    fuel += is_constant_rate ? burnt : (burnt * (burnt + 1)) / 2;
  }

  return fuel;
}

int day07_part1(char *input) {
  int *crabs = parse_crab_positions(input);

  int least_fuel_burnt = INT_MAX;
  for (int position = 1; position <= max_crab_position(crabs); position++) {
    least_fuel_burnt =
        min(least_fuel_burnt, calc_fuel_burnt(crabs, position, true));
  }

  dynarray_destroy(crabs);

  return least_fuel_burnt;
}

int day07_part2(char *input) {
  int *crabs = parse_crab_positions(input);

  int least_fuel_burnt = INT_MAX;
  for (int position = 1; position <= max_crab_position(crabs); position++) {
    least_fuel_burnt =
        min(least_fuel_burnt, calc_fuel_burnt(crabs, position, false));
  }

  dynarray_destroy(crabs);

  return least_fuel_burnt;
}

AOC_MAIN(day07);
