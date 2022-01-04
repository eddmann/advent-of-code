#include "../shared/aoc.h"

#define MAX_SIZE 15

typedef struct {
  uint8_t edges[MAX_SIZE];
  uint8_t edges_len;
  bool is_small, is_start, is_end;
} cave_t;

static uint8_t id(char *cave) {
  static char ids[MAX_SIZE][MAX_SIZE] = {0};
  static uint8_t length = 0;

  for (uint8_t i = 0; i < length; i++) {
    if (strcmp(cave, ids[i]) == 0)
      return i;
  }

  strcpy(ids[length], cave);
  return length++;
}

static uint64_t explore(cave_t *caves, uint8_t from,
                        bool small_visited_caves[MAX_SIZE],
                        bool small_cave_seen_twice) {
  if (caves[from].is_end)
    return 1;

  if (small_visited_caves[from]) {
    if (small_cave_seen_twice)
      return 0;
    small_cave_seen_twice = true;
  }

  if (caves[from].is_small)
    small_visited_caves[from] = true;

  uint64_t paths = 0;

  for (uint8_t i = 0; i < caves[from].edges_len; i++) {
    uint8_t to = caves[from].edges[i];

    if (caves[to].is_start)
      continue;

    bool next_small_visited_caves[MAX_SIZE];
    memcpy(next_small_visited_caves, small_visited_caves,
           sizeof(next_small_visited_caves));
    paths +=
        explore(caves, to, next_small_visited_caves, small_cave_seen_twice);
  }

  return paths;
}

static cave_t *build_cave_graph(const char *input) {
  cave_t *caves = calloc(MAX_SIZE, sizeof(cave_t));

  char from[6], to[6];
  uint32_t offset = 0, read = 0;

  while (2 == sscanf(input + offset, "%[^-]-%s\n%n", from, to, &read)) {
    uint8_t from_id = id(from);
    uint8_t to_id = id(to);

    caves[from_id].is_small = from[0] >= 'a';
    caves[from_id].edges[caves[from_id].edges_len++] = to_id;
    caves[to_id].is_small = to[0] >= 'a';
    caves[to_id].edges[caves[to_id].edges_len++] = from_id;

    offset += read;
  }

  caves[id("start")].is_start = true;
  caves[id("end")].is_end = true;

  return caves;
}

static uint64_t part1(const char *input) {
  cave_t *caves = build_cave_graph(input);

  bool small_visited_caves[MAX_SIZE] = {false};
  uint64_t paths = explore(caves, id("start"), small_visited_caves, true);

  free(caves);

  return paths;
}

static uint64_t part2(const char *input) {
  cave_t *caves = build_cave_graph(input);

  bool small_visited_caves[MAX_SIZE] = {false};
  uint64_t paths = explore(caves, id("start"), small_visited_caves, false);

  free(caves);

  return paths;
}

AOC_MAIN(day12, 4186, 92111);
