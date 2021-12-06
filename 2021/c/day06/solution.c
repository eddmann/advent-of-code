#include "../shared/aoc.h"
#include <stdlib.h>
#include <string.h>

#define NEW_BORN_TIMER 9
#define NEW_BORN_DAY 7

long simulate_days(char *input, int days) {
  long fish[NEW_BORN_TIMER];
  memset(fish, 0, sizeof(long) * NEW_BORN_TIMER);

  int f, offset = 0, read = 0;
  while (1 == sscanf(input + offset, "%d,%n", &f, &read)) {
    fish[f] += 1;
    offset += read;
  }

  for (int day = 0; day < days; day++) {
    fish[(day + NEW_BORN_DAY) % NEW_BORN_TIMER] += fish[day % NEW_BORN_TIMER];
  }

  long sum = 0;
  for (int i = 0; i < NEW_BORN_TIMER; i++) {
    sum += fish[i];
  }

  return sum;
}

long part1(char *input) { return simulate_days(input, 80); }

long part2(char *input) { return simulate_days(input, 256); }

AOC_MAIN();
