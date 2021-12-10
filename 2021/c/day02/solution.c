#include "../shared/aoc.h"
#include "../shared/dynarray.h"
#include <stdint.h>
#include <stdlib.h>

typedef struct Instruction {
  char move;
  uint8_t times;
} instruction_t;

static instruction_t *parse_course(const char *input) {
  instruction_t *course = dynarray_create(instruction_t);

  char move;
  uint8_t times;
  size_t offset = 0, read = 0;

  while (2 ==
         sscanf(input + offset, "%c%*s%" SCNu8 "\n%n", &move, &times, &read)) {
    instruction_t instruction = {.move = move, .times = times};
    dynarray_push(course, instruction);
    offset += read;
  }

  return course;
}

uint32_t day02_part1(char *input) {
  instruction_t *course = parse_course(input);

  uint32_t horizontal = 0, depth = 0;

  for (size_t i = 0; i < dynarray_length(course); i++) {
    switch (course[i].move) {
    case 'f':
      horizontal += course[i].times;
      break;
    case 'u':
      depth -= course[i].times;
      break;
    case 'd':
      depth += course[i].times;
      break;
    }
  }

  dynarray_destroy(course);

  return horizontal * depth;
}

uint32_t day02_part2(char *input) {
  instruction_t *course = parse_course(input);

  uint32_t horizontal = 0, depth = 0, aim = 0;

  for (size_t i = 0; i < dynarray_length(course); i++) {
    switch (course[i].move) {
    case 'f':
      horizontal += course[i].times;
      depth += aim * course[i].times;
      break;
    case 'u':
      aim -= course[i].times;
      break;
    case 'd':
      aim += course[i].times;
      break;
    }
  }

  dynarray_destroy(course);

  return horizontal * depth;
}

AOC_MAIN(day02, 1507611, 1880593125);
