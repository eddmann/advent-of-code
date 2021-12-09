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

#define PRINT_DAY(day) \
  std::cout << #day << "\n"; \
  std::cout << day##_part1(day##_input) << "\n"; \
  std::cout << day##_part2(day##_input) << "\n\n";

int main() {
  auto start = std::chrono::high_resolution_clock::now();

  PRINT_DAY(day01)
  PRINT_DAY(day02)
  PRINT_DAY(day03)
  PRINT_DAY(day04)
  PRINT_DAY(day05)
  PRINT_DAY(day06)
  PRINT_DAY(day07)
  PRINT_DAY(day08)
  PRINT_DAY(day09)

  auto finish = std::chrono::high_resolution_clock::now();

  std::chrono::duration<double> elapsed = finish - start;
  std::cout << "Elapsed time: " << elapsed.count() << "s\n";

  return 0;
}
