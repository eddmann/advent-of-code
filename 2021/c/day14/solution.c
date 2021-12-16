#include "../shared/aoc.h"
#include "../shared/dynarray.h"
#include <stdint.h>
#include <stdlib.h>

#define TOTAL_PAIRS (26 * 26)
#define idx(chr) (chr - 'A')
#define pair(a, b) (26 * a + b)
#define left(pair) (pair / 26)
#define right(pair) (pair % 26)

typedef struct ParsedInput {
  char template_[10];
  uint32_t rules[TOTAL_PAIRS];
} parsed_input_t;

static parsed_input_t parse_template_and_rules(const char *input) {
  parsed_input_t parsed = {0};

  size_t offset, read;

  sscanf(input, "%s\n\n%n", &parsed.template_, &read);
  offset += read;

  char left, right, translation;
  while (3 == sscanf(input + offset, "%c%c -> %c\n%n", &left, &right,
                     &translation, &read)) {
    offset += read;
    parsed.rules[pair(idx(left), idx(right))] = idx(translation);
  }

  return parsed;
}

uint64_t score(uint64_t frequencies[26]) {
  uint64_t max = 0;
  uint64_t min = INT64_MAX;

  for (size_t chr = 0; chr < 26; chr++) {
    if (frequencies[chr] == 0)
      continue;
    max = frequencies[chr] > max ? frequencies[chr] : max;
    min = frequencies[chr] < min ? frequencies[chr] : min;
  }

  return max - min;
}

uint64_t polymerize(char *template_, uint32_t rules[TOTAL_PAIRS],
                    size_t steps) {
  uint64_t frequencies[26] = {0};
  uint64_t pairs[TOTAL_PAIRS] = {0};

  for (size_t i = 0; i < strlen(template_); i++) {
    frequencies[idx(template_[i])] += 1;
  }

  for (size_t i = 0; i < strlen(template_) - 1; i++) {
    pairs[pair(idx(template_[i]), idx(template_[i + 1]))] += 1;
  }

  for (size_t step = 0; step < steps; step++) {
    uint64_t next_pairs[TOTAL_PAIRS] = {0};

    for (size_t pair = 0; pair < TOTAL_PAIRS; pair++) {
      if (pairs[pair] == 0)
        continue;
      int translation = rules[pair];
      frequencies[translation] += pairs[pair];
      next_pairs[pair(left(pair), translation)] += pairs[pair];
      next_pairs[pair(translation, right(pair))] += pairs[pair];
    }

    for (size_t i = 0; i < TOTAL_PAIRS; i++) {
      pairs[i] = next_pairs[i];
    }
  }

  return score(frequencies);
}

uint64_t day14_part1(const char *input) {
  parsed_input_t parsed = parse_template_and_rules(input);
  return polymerize(parsed.template_, parsed.rules, 10);
}

uint64_t day14_part2(const char *input) {
  parsed_input_t parsed = parse_template_and_rules(input);
  return polymerize(parsed.template_, parsed.rules, 40);
}

AOC_MAIN(day14, 2010, 2437698971143);
