#include "../shared/aoc.h"

static uint16_t *parse_crab_positions(const char *input) {
  uint16_t *crabs = dynarray_create(uint16_t);

  uint16_t crab;
  uint32_t offset = 0, read = 0;
  while (1 == sscanf(input + offset, "%" SCNu16 ",%n", &crab, &read)) {
    dynarray_push(crabs, crab);
    offset += read;
  }

  return crabs;
}

static uint16_t max_crab_position(uint16_t *crabs) {
  uint16_t position = 0;

  for (size_t i = 0; i < dynarray_length(crabs); i++) {
    position = MAX(position, crabs[i]);
  }

  return position;
}

static uint64_t calc_fuel_burnt(uint16_t *crabs, uint16_t position,
                                bool is_constant_rate) {
  uint64_t fuel = 0;

  for (size_t i = 0; i < dynarray_length(crabs); i++) {
    uint64_t burnt = abs(crabs[i] - position);
    fuel += is_constant_rate ? burnt : (burnt * (burnt + 1)) / 2;
  }

  return fuel;
}

static uint64_t part1(const char *input) {
  uint16_t *crabs = parse_crab_positions(input);

  uint64_t least_fuel_burnt = UINT64_MAX;
  for (size_t position = 1; position <= max_crab_position(crabs); position++) {
    least_fuel_burnt =
        MIN(least_fuel_burnt, calc_fuel_burnt(crabs, position, true));
  }

  dynarray_destroy(crabs);

  return least_fuel_burnt;
}

static uint64_t part2(const char *input) {
  uint16_t *crabs = parse_crab_positions(input);

  uint64_t least_fuel_burnt = UINT64_MAX;
  for (size_t position = 1; position <= max_crab_position(crabs); position++) {
    least_fuel_burnt =
        MIN(least_fuel_burnt, calc_fuel_burnt(crabs, position, false));
  }

  dynarray_destroy(crabs);

  return least_fuel_burnt;
}

AOC_MAIN(day07, 340987, 96987874);
