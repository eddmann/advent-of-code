#include "../shared/aoc.h"
#include "../shared/dynarray.h"
#include <stdlib.h>

#define MAX_SEGMENTS 8
#define DIGIT_PATTERNS 10
#define OUTPUT_DIGITS 4
#define PATTERNS patterns[DIGIT_PATTERNS][MAX_SEGMENTS]

typedef struct Entry {
  char PATTERNS;
  char output[OUTPUT_DIGITS][MAX_SEGMENTS];
} entry;

entry *parse_entries(char *input) {
  entry *entries = dynarray_create(entry);

  int found = 0, read = 0, offset = 0;
  while (1) {
    entry e;
    found =
        sscanf(input + offset, "%s %s %s %s %s %s %s %s %s %s | %s %s %s %s%n",
               &e.patterns[0], &e.patterns[1], &e.patterns[2], &e.patterns[3],
               &e.patterns[4], &e.patterns[5], &e.patterns[6], &e.patterns[7],
               &e.patterns[8], &e.patterns[9], &e.output[0], &e.output[1],
               &e.output[2], &e.output[3], &read);
    if (found != DIGIT_PATTERNS + OUTPUT_DIGITS)
      break;
    dynarray_push(entries, e);
    offset += read;
  }

  return entries;
}

char *find_pattern_with_len(char PATTERNS, int len) {
  for (int i = 0; i < DIGIT_PATTERNS; i++) {
    if (strlen(patterns[i]) == len) {
      return patterns[i];
    }
  }
}

int count_pattern_similarities(char *a, char *b) {
  int sum = 0;

  for (char *aa = a; *aa != '\0'; aa++) {
    for (char *bb = b; *bb != '\0'; bb++) {
      sum += *aa == *bb;
    }
  }

  return sum;
}

int decode_output(entry e) {
  char *one = find_pattern_with_len(e.patterns, 2);
  char *four = find_pattern_with_len(e.patterns, 4);

  char decoded[4];

  for (int i = 0; i < OUTPUT_DIGITS; i++) {
    char *digit = e.output[i];
    int digit_len = strlen(digit);
    int one_sim = count_pattern_similarities(digit, one);
    int four_sim = count_pattern_similarities(digit, four);

    if (one_sim == 1) {
      if (digit_len == 6)
        decoded[i] = '6';
      else
        decoded[i] = (four_sim == 2) ? '2' : '5';
      continue;
    }

    if (digit_len == 2)
      decoded[i] = '1';
    if (digit_len == 3)
      decoded[i] = '7';
    if (digit_len == 4)
      decoded[i] = '4';
    if (digit_len == 5)
      decoded[i] = '3';
    if (digit_len == 6)
      decoded[i] = (four_sim == 3) ? '0' : '9';
    if (digit_len == 7)
      decoded[i] = '8';
  }

  return atoi(decoded);
}

int day08_part1(char *input) {
  entry *entries = parse_entries(input);

  int sum = 0;

  for (int i = 0; i < dynarray_length(entries); i++) {
    for (int j = 0; j < OUTPUT_DIGITS; j++) {
      int len = strlen(entries[i].output[j]);
      sum += len == 2 || len == 3 || len == 4 || len == 7;
    }
  }

  dynarray_destroy(entries);

  return sum;
}

int day08_part2(char *input) {
  entry *entries = parse_entries(input);

  int sum = 0;

  for (int i = 0; i < dynarray_length(entries); i++) {
    sum += decode_output(entries[i]);
  }

  dynarray_destroy(entries);

  return sum;
}

AOC_MAIN(day08);
