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

#ifdef RUN_TESTS

#define AOC_MAIN()                                                             \
  int main(int argc, char *argv[]) { return EXIT_SUCCESS; }

#else

#define AOC_MAIN()                                                             \
  int main(int argc, char *argv[]) {                                           \
    char *input = read_input("input.txt");                                     \
    printf("Part 1: %ld\n", part1(input));                                     \
    printf("Part 2: %ld\n", part2(input));                                     \
    free(input);                                                               \
    return EXIT_SUCCESS;                                                       \
  }

#endif
