#include "../shared/aoc.h"
#include <math.h>

typedef struct {
  int32_t a, b;
} tuple_t;

static tuple_t *parse_sections(const char *input) {
  tuple_t *sections = dynarray_create(tuple_t);

  uint8_t block = -1;
  uint8_t line_no = 0;
  bool is_inc = false;

  char line[2048];
  uint32_t offset = 0, read = 0;

  while (1 == sscanf(input + offset, "%[^\n]\n%n", line, &read)) {
    offset += read;
    line_no++;

    if (strncmp(line, "inp", 3) == 0) {
      line_no = 0;
      block++;
      is_inc = false;
      continue;
    }

    if (line_no == 4) {
      if (line[strlen(line) - 1] == '1')
        is_inc = true;
      continue;
    }

    if (!is_inc && line_no == 5) {
      int32_t mod = 0;
      assert(sscanf(line, "add x %d", &mod) == 1);
      tuple_t s = {.a = 0, .b = mod};
      dynarray_push(sections, s);
      continue;
    }

    if (is_inc && line_no == 15) {
      int32_t inc = 0;
      assert(sscanf(line, "add y %d", &inc) == 1);
      tuple_t s = {.a = inc, .b = 0};
      dynarray_push(sections, s);
      continue;
    }
  }

  return sections;
}

static uint64_t solve(tuple_t *sections, uint8_t initial_digit,
                      int8_t (*acc)(int8_t, int8_t)) {
  size_t section_len = dynarray_length(sections);
  tuple_t *stack = dynarray_create(tuple_t);
  uint64_t result = 0;

  for (uint8_t i = 0; i < section_len; i++) {
    tuple_t section = sections[i];

    if (section.a) {
      tuple_t t = {.a = i, .b = section.a};
      dynarray_push(stack, t);
      continue;
    }

    tuple_t t;
    dynarray_pop(stack, &t);

    int8_t diff = t.b + section.b;
    result += pow(10, section_len - t.a - 1) *
              acc(initial_digit, initial_digit - diff);
    result +=
        pow(10, section_len - i - 1) * acc(initial_digit, initial_digit + diff);
  }

  dynarray_destroy(stack);

  return result;
}

static int8_t min(int8_t a, int8_t b) { return MIN(a, b); }

static int8_t max(int8_t a, int8_t b) { return MAX(a, b); }

static uint64_t part1(const char *input) {
  tuple_t *sections = parse_sections(input);

  uint64_t result = solve(sections, 9, min);

  dynarray_destroy(sections);

  return result;
}

static uint64_t part2(const char *input) {
  tuple_t *sections = parse_sections(input);

  uint64_t result = solve(sections, 1, max);

  dynarray_destroy(sections);

  return result;
}

AOC_MAIN(day24, 99598963999971, 93151411711211);
