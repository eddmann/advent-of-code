#ifndef AOC
#define AOC

#include "dynarray.h"
#include <assert.h>
#include <inttypes.h>
#include <stdbool.h>
#include <stdio.h>
#include <stdlib.h>

#define MAX(a, b)                                                              \
  ({                                                                           \
    __typeof__(a) _a = (a);                                                    \
    __typeof__(b) _b = (b);                                                    \
    _a > _b ? _a : _b;                                                         \
  })

#define MIN(a, b)                                                              \
  ({                                                                           \
    __typeof__(a) _a = (a);                                                    \
    __typeof__(b) _b = (b);                                                    \
    _a < _b ? _a : _b;                                                         \
  })

#ifdef AOC_TEST_RUNNER

static char *read_input(const char *filename) {
  FILE *file = fopen(filename, "rb");

  if (!file) {
    printf("[ERROR] File not found\n");
    exit(EXIT_FAILURE);
  }

  fseek(file, 0, SEEK_END);
  size_t length = ftell(file);
  fseek(file, 0, SEEK_SET);

  char *buffer = (char *)malloc(length + 1);

  size_t read = length > 0 ? fread(buffer, 1, length, file) : 0;
  if (read != length) {
    free(buffer);
    printf("[ERROR] Failed to read file\n");
    exit(EXIT_FAILURE);
  }

  fclose(file);

  buffer[length] = '\0';

  return buffer;
}

#define AOC_MAIN(day, p1_answer, p2_answer)                                    \
  int main(int argc, char *argv[]) {                                           \
    char *input = read_input("input.txt");                                     \
    uint64_t p1 = part1(input);                                                \
    if (p1 == p1_answer) {                                                     \
      printf(#day " p1 ✔\n");                                                  \
    } else {                                                                   \
      printf(#day " p1 ✗ - expected " #p1_answer ", got %" PRId64 "\n", p1);   \
      exit(1);                                                                 \
    }                                                                          \
    uint64_t p2 = part2(input);                                                \
    if (p2 == p2_answer) {                                                     \
      printf(#day " p2 ✔\n");                                                  \
    } else {                                                                   \
      printf(#day " p2 ✗ - expected " #p2_answer ", got %" PRId64 "\n", p2);   \
      exit(1);                                                                 \
    }                                                                          \
    free(input);                                                               \
    return EXIT_SUCCESS;                                                       \
  }

#elif defined(AOC_SINGLE_EXECUTABLE)

static char *read_input(const char *filename) {
  FILE *file = fopen(filename, "rb");

  if (!file) {
    printf("[ERROR] File not found\n");
    exit(EXIT_FAILURE);
  }

  fseek(file, 0, SEEK_END);
  size_t length = ftell(file);
  fseek(file, 0, SEEK_SET);

  char *buffer = (char *)malloc(length + 1);

  size_t read = length > 0 ? fread(buffer, 1, length, file) : 0;
  if (read != length) {
    free(buffer);
    printf("[ERROR] Failed to read file\n");
    exit(EXIT_FAILURE);
  }

  fclose(file);

  buffer[length] = '\0';

  return buffer;
}

#define AOC_MAIN(day, p1_answer, p2_answer)                                    \
  int main(int argc, char *argv[]) {                                           \
    char *input = read_input("input.txt");                                     \
    printf("Part 1: %" PRId64 "\n", part1(input));                             \
    printf("Part 2: %" PRId64 "\n", part2(input));                             \
    free(input);                                                               \
    return EXIT_SUCCESS;                                                       \
  }

#elif defined(AOC_PICO)

#define SCNu8 "hhu"
#define SCNi64 "lli"

#define AOC_MAIN(day, p1_answer, p2_answer)                                    \
  uint64_t day##_part1(char *input) { return part1(input); }                   \
  uint64_t day##_part2(char *input) { return part2(input); }

#else

#define AOC_MAIN(day, p1_answer, p2_answer)                                    \
  void day(char *input) {                                                      \
    uint64_t p1 = part1(input);                                                \
    assert(p1 == p1_answer);                                                   \
    printf("Part 1: %" PRId64 "\n", p1);                                       \
    uint64_t p2 = part2(input);                                                \
    assert(p2 == p2_answer);                                                   \
    printf("Part 2: %" PRId64 "\n", p2);                                       \
  }

#endif

#endif
