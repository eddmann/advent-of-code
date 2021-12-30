#include "../shared/aoc.h"
#include "../shared/dynarray.h"
#include <stdbool.h>
#include <stdint.h>
#include <stdlib.h>
#include <string.h>

#define PAPER_SIZE 1320

typedef struct Paper {
  bool dots[PAPER_SIZE][PAPER_SIZE];
  uint16_t width, height;
} paper_t;

typedef struct Fold {
  char coord;
  uint16_t value;
} fold_t;

static paper_t parse_paper(const char *input) {
  paper_t paper = {0};
  paper.width = PAPER_SIZE;
  paper.height = PAPER_SIZE;

  uint16_t x, y;
  size_t offset = 0, read = 0;

  while (2 == sscanf(input + offset, "%d,%d%n", &x, &y, &read)) {
    paper.dots[y][x] = true;
    offset += read;
  }

  return paper;
}

static fold_t *parse_folds(const char *input) {
  fold_t *folds = dynarray_create(fold_t);

  char coord;
  uint16_t value;
  size_t offset = strstr(input, "\n\n") - input + 2;
  size_t read = 0;

  while (2 == sscanf(input + offset, "fold along %c=%" SCNu16 "\n%n", &coord,
                     &value, &read)) {
    fold_t fold = {.coord = coord, .value = value};
    dynarray_push(folds, fold);
    offset += read;
  }

  return folds;
}

static void apply_fold(paper_t *paper, fold_t fold) {
  if (fold.coord == 'x') {
    for (uint16_t y = 0; y < paper->width; y++)
      for (uint16_t f = 0; f < fold.value; f++)
        if (paper->dots[y][fold.value * 2 - f])
          paper->dots[y][f] = true;

    paper->width = fold.value;
    return;
  }

  for (uint16_t f = 0; f < fold.value; f++)
    for (uint16_t x = 0; x < paper->width; x++)
      if (paper->dots[fold.value * 2 - f][x])
        paper->dots[f][x] = true;

  paper->height = fold.value;
}

uint32_t day13_part1(const char *input) {
  paper_t paper = parse_paper(input);
  fold_t *folds = parse_folds(input);

  apply_fold(&paper, folds[0]);

  uint16_t visible_dots = 0;
  for (uint16_t y = 0; y < paper.height; y++)
    for (uint16_t x = 0; x < paper.width; x++)
      visible_dots += paper.dots[y][x];

  dynarray_destroy(folds);

  return visible_dots;
}

uint32_t day13_part2(const char *input) {
  paper_t paper = parse_paper(input);
  fold_t *folds = parse_folds(input);

  for (int i = 0; i < dynarray_length(folds); i++)
    apply_fold(&paper, folds[i]);

#ifndef TEST_RUNNER
  printf("\n");
  for (int y = 0; y < paper.height; y++) {
    for (int x = 0; x < paper.width; x++)
      printf(paper.dots[y][x] ? "#" : " ");
    printf("\n");
  }
  printf("\n");
#endif

  dynarray_destroy(folds);

  return 0;
}

AOC_MAIN(day13, 621, 0);
