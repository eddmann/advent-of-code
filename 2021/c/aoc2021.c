#include <inttypes.h>
#include <stdint.h>
#include <stdio.h>
#include <stdlib.h>
#include <sys/time.h>

#include "day01/input.h"
#include "day02/input.h"
#include "day03/input.h"
#include "day04/input.h"
#include "day05/input.h"
#include "day06/input.h"
#include "day07/input.h"
#include "day08/input.h"
#include "day09/input.h"
#include "day10/input.h"
#include "day11/input.h"
#include "day12/input.h"
#include "day13/input.h"
#include "day14/input.h"
#include "day15/input.h"
#include "day16/input.h"
#include "day17/input.h"
#include "day18/input.h"
#include "day20/input.h"
#include "day22/input.h"
#include "day25/input.h"

void day01(const char *input);
void day02(const char *input);
void day03(const char *input);
void day04(const char *input);
void day05(const char *input);
void day06(const char *input);
void day07(const char *input);
void day08(const char *input);
void day09(const char *input);
void day10(const char *input);
void day11(const char *input);
void day12(const char *input);
void day13(const char *input);
void day14(const char *input);
void day15(const char *input);
void day16(const char *input);
void day17(const char *input);
void day18(const char *input);
void day20(const char *input);
void day22(const char *input);
void day25(const char *input);

#define RUN(day)                                                               \
  printf("\n" #day "\n");                                                      \
  day(day##_input);

int main(int argc, char **argv) {
  struct timeval start, end, diff;

  printf("   ,--.\n  ()   \\\n   /    \\\n _/______\\_\n(__________)\n(/  @  @ "
         " \\)\n(`._,()._,')  AoC 2021 in C\n(  `-'`-'  )\n \\        /\n  "
         "\\,,,,,,/\n");

  gettimeofday(&start, NULL);

  RUN(day01);
  RUN(day02);
  RUN(day03);
  RUN(day04);
  RUN(day05);
  RUN(day06);
  RUN(day07);
  RUN(day08);
  RUN(day09);
  RUN(day10);
  RUN(day11);
  RUN(day12);
  RUN(day13);
  RUN(day14);
  RUN(day15);
  RUN(day16);
  RUN(day17);
  RUN(day18);
  RUN(day20);
  RUN(day22);
  RUN(day25);

  gettimeofday(&end, NULL);
  timersub(&end, &start, &diff);

  uint64_t total = (uint64_t)(diff.tv_sec * 1000000) + (uint64_t)diff.tv_usec;
  printf("\nTotal: %" PRId64 " μs (%.2f s)\n", total,
         (double)total / 1000000.0);

  return EXIT_SUCCESS;
}
