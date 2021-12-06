#include "../shared/aoc.h"
#include "../shared/dynarray.h"
#include <stdlib.h>

typedef struct Instruction {
  char move;
  int times;
} instruction;

instruction *parse_course(char *input) {
  instruction *course = dynarray_create(instruction);

  char move;
  int times, offset = 0, read = 0;

  while (2 == sscanf(input + offset, "%c%*s%d\n%n", &move, &times, &read)) {
    instruction in;
    in.move = move;
    in.times = times;

    dynarray_push(course, in);

    offset += read;
  }

  return course;
}

int day02_part1(char *input) {
  instruction *course = parse_course(input);

  int horizontal = 0;
  int depth = 0;

  for (int i = 0; i < dynarray_length(course); i++) {
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

int day02_part2(char *input) {
  instruction *course = parse_course(input);

  int horizontal = 0;
  int depth = 0;
  int aim = 0;

  for (int i = 0; i < dynarray_length(course); i++) {
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

AOC_MAIN(day02);
