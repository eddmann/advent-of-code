#ifndef AOC
#define AOC

#include <assert.h>
#include <inttypes.h>
#include <stdio.h>
#include <stdlib.h>

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

#ifdef TEST_RUNNER

#define AOC_MAIN(day, part1_answer, part2_answer)                              \
  int main(int argc, char *argv[]) { return EXIT_SUCCESS; }

#elif defined(SINGLE_EXECUTABLE)

#define AOC_MAIN(day, part1_answer, part2_answer)                              \
  int main(int argc, char *argv[]) {                                           \
    char *input = read_input("input.txt");                                     \
    uint64_t part1 = day##_part1(input);                                       \
    assert(part1 == part1_answer);                                             \
    printf("Part 1: %" PRId64 "\n", part1);                                    \
    uint64_t part2 = day##_part2(input);                                       \
    assert(part2 == part2_answer);                                             \
    printf("Part 2: %" PRId64 "\n", part2);                                    \
    free(input);                                                               \
    return EXIT_SUCCESS;                                                       \
  }

#else

#define AOC_MAIN(day, part1_answer, part2_answer)

#endif

#endif