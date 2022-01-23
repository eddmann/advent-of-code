#include <cstdlib>
#include <math.h>
#include <stdio.h>
#include <string.h>

#include "display/pico_display.hpp"
#include "display/pico_graphics.hpp"

#include "../day01/input.h"
#include "../day02/input.h"
#include "../day03/input.h"
#include "../day04/input.h"
#include "../day05/input.h"
#include "../day06/input.h"
#include "../day07/input.h"
#include "../day08/input.h"
#include "../day09/input.h"
#include "../day10/input.h"
#include "../day11/input.h"
#include "../day12/input.h"
#include "../day13/input.h"
#include "../day14/input.h"
#include "../day15/input.h"
#include "../day16/input.h"
#include "../day17/input.h"
#include "../day18/input.h"
#include "../day20/input.h"
#include "../day21/input.h"
#include "../day22/input.h"
#include "../day23/input.h"
#include "../day24/input.h"
#include "../day25/input.h"

#define TOTAL_DAYS 25
#define DAYS_PER_PAGE 4
#define LINE_HEIGHT 25

#define SOLUTION(day)                                                          \
  extern "C" {                                                                 \
  uint64_t day##_part1(char *input);                                           \
  uint64_t day##_part2(char *input);                                           \
  }                                                                            \
  void day() {                                                                 \
    uint64_t part1 = day##_part1(day##_input);                                 \
    uint64_t part2 = day##_part2(day##_input);                                 \
    blank_screen();                                                            \
    pico_display.set_pen(white);                                               \
    pico_display.text("P1: " + std::to_string(part1), Point(0, 10),            \
                      PicoDisplay::WIDTH, 3);                                  \
    pico_display.text("P2: " + std::to_string(part2), Point(0, 40),            \
                      PicoDisplay::WIDTH, 3);                                  \
    pico_display.update();                                                     \
  }

#define NOT_IMPLEMENTED(day)                                                   \
  void day() {                                                                 \
    blank_screen();                                                            \
    pico_display.set_pen(white);                                               \
    pico_display.text("P1: TODO", Point(0, 10), PicoDisplay::WIDTH, 3);        \
    pico_display.text("P2: TODO", Point(0, 40), PicoDisplay::WIDTH, 3);        \
    pico_display.update();                                                     \
  }

using namespace pimoroni;

uint16_t buffer[PicoDisplay::WIDTH * PicoDisplay::HEIGHT];
PicoDisplay pico_display(buffer);

const uint16_t white = pico_display.create_pen(255, 255, 255);
const uint16_t black = pico_display.create_pen(0, 0, 0);

inline void blank_screen() {
  pico_display.set_pen(black);
  pico_display.clear();
}

SOLUTION(day01);
NOT_IMPLEMENTED(day02);
SOLUTION(day03);
NOT_IMPLEMENTED(day04);
NOT_IMPLEMENTED(day05);
NOT_IMPLEMENTED(day06);
SOLUTION(day07);
NOT_IMPLEMENTED(day08);
NOT_IMPLEMENTED(day09);
SOLUTION(day10);
SOLUTION(day11);
SOLUTION(day12);
NOT_IMPLEMENTED(day13);
SOLUTION(day14);
NOT_IMPLEMENTED(day15);
SOLUTION(day16);
SOLUTION(day17);
SOLUTION(day18);
NOT_IMPLEMENTED(day19);
NOT_IMPLEMENTED(day20);
SOLUTION(day21);
NOT_IMPLEMENTED(day22);
NOT_IMPLEMENTED(day23);
NOT_IMPLEMENTED(day24);
SOLUTION(day25);

void (*solutions[])() = {day01, day02, day03, day04, day05, day06,
                         day07, day08, day09, day10, day11, day12,
                         day13, day14, day15, day16, day17, day18,
                         day19, day20, day21, day22, day23, day24,
                         day25};

void display_answer(uint8_t day) {
  blank_screen();
  pico_display.set_pen(white);
  pico_display.text("Loading...", Point(0, 10), PicoDisplay::WIDTH, 3);
  pico_display.update();

  solutions[day]();

  while (!pico_display.is_pressed(pico_display.Y)) {
    sleep_ms(150);
  }

  blank_screen();
  pico_display.update();
}

int main() {
  static uint8_t selected_day = 0;

  pico_display.init();
  pico_display.set_backlight(100);

  while (true) {
    blank_screen();

    if (pico_display.is_pressed(pico_display.A)) {
      selected_day = std::max(selected_day - 1, 0);
    } else if (pico_display.is_pressed(pico_display.B)) {
      selected_day = std::min(selected_day + 1, TOTAL_DAYS - 1);
    } else if (pico_display.is_pressed(pico_display.X)) {
      display_answer(selected_day);
    }

    uint8_t page_day = selected_day / DAYS_PER_PAGE * DAYS_PER_PAGE;

    for (int offset = 0; offset < DAYS_PER_PAGE; offset++) {
      uint8_t day = page_day + offset;

      if (day >= TOTAL_DAYS)
        continue;

      if (day == selected_day) {
        pico_display.set_pen(white);
        Rect text_rect(0, (offset + 1) * LINE_HEIGHT, PicoDisplay::WIDTH,
                       LINE_HEIGHT);
        pico_display.rectangle(text_rect);
        pico_display.set_pen(black);
        pico_display.text(" > Day " + std::to_string(day + 1),
                          Point(0, (offset + 1) * LINE_HEIGHT),
                          PicoDisplay::WIDTH, 3);
        continue;
      }

      pico_display.set_pen(white);
      pico_display.text("Day " + std::to_string(day + 1),
                        Point(0, (offset + 1) * LINE_HEIGHT),
                        PicoDisplay::WIDTH, 3);
    }

    pico_display.update();

    sleep_ms(150);
  }

  return 0;
}
