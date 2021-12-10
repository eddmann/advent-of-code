#include "../shared/aoc.h"
#include "../shared/dynarray.h"
#include <stdlib.h>

#define BUFFER_SIZE 4096

int syntax_error_score(char line[BUFFER_SIZE]) {
  char *stack = dynarray_create(char);

  int score = 0;

  for (int i = 0; line[i] != '\0' && score == 0; i++) {
    char token = line[i];

    if (!(token == ')' || token == ']' || token == '}' || token == '>')) {
      dynarray_push(stack, token);
      continue;
    }

    char open;
    dynarray_pop(stack, &open);
    if (token == ')' && open != '(')
      score = 3;
    if (token == ']' && open != '[')
      score = 57;
    if (token == '}' && open != '{')
      score = 1197;
    if (token == '>' && open != '<')
      score = 25137;
  }

  dynarray_destroy(stack);

  return score;
}

long autocomplete_score(char line[BUFFER_SIZE]) {
  char *stack = dynarray_create(char);

  for (int i = 0; line[i] != '\0'; i++) {
    char token = line[i];

    if (token == ')' || token == ']' || token == '}' || token == '>') {
      char ignored;
      dynarray_pop(stack, &ignored);
      continue;
    }

    dynarray_push(stack, token);
  }

  long score = 0;
  while (dynarray_length(stack) > 0) {
    char token;
    dynarray_pop(stack, &token);

    score *= 5;
    if (token == '(')
      score += 1;
    if (token == '[')
      score += 2;
    if (token == '{')
      score += 3;
    if (token == '<')
      score += 4;
  }

  dynarray_destroy(stack);

  return score;
}

int cmp_ascending(const void *a, const void *b) {
  if (*(long *)a - *(long *)b < 0)
    return -1;
  if (*(long *)a - *(long *)b > 0)
    return 1;
  return 0;
}

int day10_part1(char *input) {
  char line[BUFFER_SIZE];
  int read = 0, offset = 0, score = 0;

  while (1 == sscanf(input + offset, "%s%n", line, &read)) {
    score += syntax_error_score(line);
    offset += read;
  }

  return score;
}

long day10_part2(char *input) {
  char line[BUFFER_SIZE];
  int read = 0, offset = 0;
  long *scores = dynarray_create(long);

  while (1 == sscanf(input + offset, "%s%n", line, &read)) {
    if (syntax_error_score(line) == 0) {
      long score = autocomplete_score(line);
      dynarray_push(scores, score);
    }
    offset += read;
  }

  qsort(scores, dynarray_length(scores), sizeof(long), cmp_ascending);

  long result = scores[dynarray_length(scores) / 2];

  dynarray_destroy(scores);

  return result;
}

AOC_MAIN(day10);
