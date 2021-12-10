#include "../shared/aoc.h"
#include <stdint.h>
#include <stdlib.h>
#include <string.h>

#define NEW_BORN_TIMER 9
#define NEW_BORN_DAY 7

static uint64_t simulate_days(char *input, uint16_t days) {
  uint64_t fish[NEW_BORN_TIMER] = {0};

  uint8_t f;
  size_t offset = 0, read = 0;
  while (1 == sscanf(input + offset, "%" SCNu8 ",%n", &f, &read)) {
    fish[f] += 1;
    offset += read;
  }

  for (uint16_t day = 0; day < days; day++) {
    fish[(day + NEW_BORN_DAY) % NEW_BORN_TIMER] += fish[day % NEW_BORN_TIMER];
  }

  uint64_t sum = 0;
  for (uint8_t i = 0; i < NEW_BORN_TIMER; i++) {
    sum += fish[i];
  }

  return sum;
}

uint64_t day06_part1(char *input) { return simulate_days(input, 80); }

uint64_t day06_part2(char *input) { return simulate_days(input, 256); }

AOC_MAIN(day06, 350605, 1592778185024);
