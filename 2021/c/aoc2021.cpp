#include <iostream>
#include <chrono>

#include "day01/input.h"
#include "day01/solution.c"
#include "day02/input.h"
#include "day02/solution.c"
#include "day03/input.h"
#include "day03/solution.c"
#include "day04/input.h"
#include "day04/solution.c"
#include "day05/input.h"
#include "day05/solution.c"
#include "day06/input.h"
#include "day06/solution.c"
#include "day07/input.h"
#include "day07/solution.c"
#include "day08/input.h"
#include "day08/solution.c"
#include "day09/input.h"
#include "day09/solution.c"
#include "day10/input.h"
#include "day10/solution.c"
#include "day11/input.h"
#include "day11/solution.c"
#include "day12/input.h"
#include "day12/solution.c"
#include "day13/input.h"
#include "day13/solution.c"
#include "day14/input.h"
#include "day14/solution.c"
#include "day15/input.h"
#include "day15/solution.c"
#include "day17/input.h"
#include "day17/solution.c"

#define PRINT_DAY(day) \
  std::cout << #day << "\n"; \
  std::cout << day##_part1(day##_input) << "\n"; \
  std::cout << day##_part2(day##_input) << "\n\n";

int main() {
  typedef std::chrono::high_resolution_clock Time;
  typedef std::chrono::milliseconds ms;

  auto start = Time::now();

  PRINT_DAY(day01)
  PRINT_DAY(day02)
  PRINT_DAY(day03)
  PRINT_DAY(day04)
  PRINT_DAY(day05)
  PRINT_DAY(day06)
  PRINT_DAY(day07)
  PRINT_DAY(day08)
  PRINT_DAY(day09)
  PRINT_DAY(day10)
  PRINT_DAY(day11)
  PRINT_DAY(day12)
  PRINT_DAY(day13)
  PRINT_DAY(day14)
  PRINT_DAY(day15)
  PRINT_DAY(day17)

  auto end = Time::now();
  ms elapsed = std::chrono::duration_cast<ms>(end - start);
  std::cout << "Elapsed time: " << elapsed.count() << "ms\n";

  return 0;
}
