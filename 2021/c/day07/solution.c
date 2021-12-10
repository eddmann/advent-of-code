#include "../shared/aoc.h"
#include "../shared/dynarray.h"
#include <stdbool.h>
#include <stdint.h>
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

static uint16_t *parse_crab_positions(const char *input) {
  uint16_t *crabs = dynarray_create(uint16_t);

  uint16_t crab;
  size_t offset = 0, read = 0;
  while (1 == sscanf(input + offset, "%" SCNu16 ",%n", &crab, &read)) {
    dynarray_push(crabs, crab);
    offset += read;
  }

  return crabs;
}

static uint16_t max_crab_position(uint16_t *crabs) {
  uint16_t position = 0;

  for (size_t i = 0; i < dynarray_length(crabs); i++) {
    position = max(position, crabs[i]);
  }

  return position;
}

static uint32_t calc_fuel_burnt(uint16_t *crabs, uint16_t position,
                                bool is_constant_rate) {
  uint32_t fuel = 0;

  for (size_t i = 0; i < dynarray_length(crabs); i++) {
    uint32_t burnt = abs(crabs[i] - position);
    fuel += is_constant_rate ? burnt : (burnt * (burnt + 1)) / 2;
  }

  return fuel;
}

uint32_t day07_part1(const char *input) {
  uint16_t *crabs = parse_crab_positions(input);

  uint32_t least_fuel_burnt = UINT32_MAX;
  for (uint16_t position = 1; position <= max_crab_position(crabs);
       position++) {
    least_fuel_burnt =
        min(least_fuel_burnt, calc_fuel_burnt(crabs, position, true));
  }

  dynarray_destroy(crabs);

  return least_fuel_burnt;
}

int day07_part2(const char *input) {
  uint16_t *crabs = parse_crab_positions(input);

  uint32_t least_fuel_burnt = UINT32_MAX;
  for (uint16_t position = 1; position <= max_crab_position(crabs);
       position++) {
    least_fuel_burnt =
        min(least_fuel_burnt, calc_fuel_burnt(crabs, position, false));
  }

  dynarray_destroy(crabs);

  return least_fuel_burnt;
}

AOC_MAIN(day07, 340987, 96987874);
