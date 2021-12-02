#include "../shared/dynarray.h"
#include "../shared/input.h"
#include <stdlib.h>

typedef struct Instruction {
  char move;
  int times;
} instruction;

instruction *parse_course(char *input) {
  instruction *course = dynarray_create(instruction);

  char move;
  int times, offset, read;

  while (2 == sscanf(input + offset, "%c%*s%d\n%n", &move, &times, &read)) {
    instruction in;
    in.move = move;
    in.times = times;

    dynarray_push(course, in);

    offset += read;
  }

  return course;
}

int part1(instruction *course) {
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

  return horizontal * depth;
}

int part2(instruction *course) {
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

  return horizontal * depth;
}

int main(int argc, char *argv[]) {
  char *input = read_input_or_exit("input.txt");
  instruction *course = parse_course(input);

  printf("Part 1: %d\n", part1(course));
  printf("Part 2: %d\n", part2(course));

  dynarray_destroy(course);
  free(input);

  return EXIT_SUCCESS;
}
