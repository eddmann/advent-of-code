#include "../shared/aoc.h"

typedef char *str_expression_t;

typedef struct number {
  uint8_t depth;
  uint32_t value;
} number_t;

typedef struct {
  struct number numbers[35];
  size_t size;
} expression_t;

static void delete_number(expression_t *expression, int idx) {
  assert(idx > 0);
  memmove(expression->numbers + idx, expression->numbers + idx + 1,
          (expression->size - idx) * sizeof(number_t));
  expression->size--;
}

static void insert_number(expression_t *expression, size_t idx) {
  assert(idx < expression->size);
  memmove(expression->numbers + idx + 1, expression->numbers + idx,
          (expression->size - idx + 1) * sizeof(number_t));
  expression->size++;
}

static str_expression_t *parse_expressions(const char *input) {
  str_expression_t *expressions = dynarray_create(str_expression_t);

  char expression[100];
  uint32_t read = 0, offset = 0;

  while (1 == sscanf(input + offset, "%s%n", expression, &read)) {
    str_expression_t expr = strdup(expression);
    dynarray_push(expressions, expr);
    offset += read;
  }

  return expressions;
}

static void destroy_expressions(str_expression_t *expressions) {
  for (size_t i = 0; i < dynarray_length(expressions); i++)
    free(expressions[i]);

  dynarray_destroy(expressions);
}

static bool explode(expression_t *expression) {
  for (size_t i = 1; i < expression->size; i++) {
    if (expression->numbers[i].depth != 5 ||
        expression->numbers[i - 1].depth != 5)
      continue;

    if (i > 1)
      expression->numbers[i - 2].value += expression->numbers[i - 1].value;

    if (i + 1 < expression->size)
      expression->numbers[i + 1].value += expression->numbers[i].value;

    expression->numbers[i - 1].value = 0;
    expression->numbers[i - 1].depth--;

    delete_number(expression, i);

    return true;
  }

  return false;
}

static bool split(expression_t *expression) {
  for (size_t i = 0; i < expression->size; i++) {
    if (expression->numbers[i].value < 10)
      continue;

    insert_number(expression, i);

    expression->numbers[i].depth = ++expression->numbers[i + 1].depth;
    expression->numbers[i].value = expression->numbers[i + 1].value / 2;
    expression->numbers[i + 1].value =
        expression->numbers[i + 1].value - expression->numbers[i].value;

    return true;
  }

  return false;
}

static void sum(expression_t *accumulator, str_expression_t str_expression) {
  for (size_t i = 0; i < accumulator->size; i++)
    accumulator->numbers[i].depth++;

  uint8_t depth = accumulator->size == 0 ? 0 : 1;

  for (size_t i = 0; str_expression[i] != '\0'; i++) {
    if (str_expression[i] == '[') {
      depth++;
      continue;
    }

    if (str_expression[i] == ']') {
      depth--;
      continue;
    }

    if (str_expression[i] >= '0' && str_expression[i] <= '9') {
      accumulator->numbers[accumulator->size].value = str_expression[i] - '0';
      accumulator->numbers[accumulator->size].depth = depth;
      accumulator->size++;
    }
  }

  while (explode(accumulator) || split(accumulator))
    ;
}

static uint32_t magnitude(expression_t *expression) {
  while (expression->size > 1) {
    for (size_t i = 0; i < expression->size - 1; i++) {
      if (expression->numbers[i].depth != expression->numbers[i + 1].depth)
        continue;

      expression->numbers[i].value = 3 * expression->numbers[i].value +
                                     2 * expression->numbers[i + 1].value;
      expression->numbers[i].depth--;

      delete_number(expression, i + 1);
      break;
    }
  }

  return expression->numbers[0].value;
}

static uint64_t part1(const char *input) {
  str_expression_t *expressions = parse_expressions(input);

  expression_t *accumulator = calloc(1, sizeof(expression_t));

  for (size_t i = 0; i < dynarray_length(expressions); i++)
    sum(accumulator, expressions[i]);

  uint64_t total = magnitude(accumulator);

  destroy_expressions(expressions);
  free(accumulator);

  return total;
}

static uint64_t part2(const char *input) {
  str_expression_t *expressions = parse_expressions(input);

  expression_t *accumulator = calloc(1, sizeof(expression_t));
  uint64_t max = 0;

  for (size_t i = 0; i < dynarray_length(expressions); i++) {
    for (size_t j = 0; j < dynarray_length(expressions); j++) {
      if (i == j)
        continue;

      memset(accumulator, 0, sizeof(expression_t));
      sum(accumulator, expressions[i]);
      sum(accumulator, expressions[j]);
      max = MAX(max, magnitude(accumulator));
    }
  }

  destroy_expressions(expressions);
  free(accumulator);

  return max;
}

AOC_MAIN(day18, 4137, 4573);
