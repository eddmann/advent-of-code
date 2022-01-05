#include "../shared/aoc.h"

#define PAPER_SIZE 1320

typedef struct {
  bool dots[PAPER_SIZE][PAPER_SIZE];
  uint16_t width, height;
} paper_t;

typedef struct {
  char coord;
  uint16_t value;
} fold_t;

static paper_t parse_paper(const char *input) {
  paper_t paper = {0};
  paper.width = PAPER_SIZE;
  paper.height = PAPER_SIZE;

  uint16_t x, y;
  uint32_t offset = 0, read = 0;

  while (2 ==
         sscanf(input + offset, "%" SCNu16 ",%" SCNu16 "%n", &x, &y, &read)) {
    paper.dots[y][x] = true;
    offset += read;
  }

  return paper;
}

static fold_t *parse_folds(const char *input) {
  fold_t *folds = dynarray_create(fold_t);

  char coord;
  uint16_t value;
  uint32_t offset = strstr(input, "\n\n") - input + 2;
  uint32_t read = 0;

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
    for (size_t y = 0; y < paper->width; y++)
      for (size_t f = 0; f < fold.value; f++)
        if (paper->dots[y][fold.value * 2 - f])
          paper->dots[y][f] = true;

    paper->width = fold.value;
    return;
  }

  for (size_t f = 0; f < fold.value; f++)
    for (size_t x = 0; x < paper->width; x++)
      if (paper->dots[fold.value * 2 - f][x])
        paper->dots[f][x] = true;

  paper->height = fold.value;
}

static uint64_t part1(const char *input) {
  paper_t paper = parse_paper(input);
  fold_t *folds = parse_folds(input);

  apply_fold(&paper, folds[0]);

  uint64_t visible_dots = 0;
  for (size_t y = 0; y < paper.height; y++)
    for (size_t x = 0; x < paper.width; x++)
      visible_dots += paper.dots[y][x];

  dynarray_destroy(folds);

  return visible_dots;
}

static uint64_t part2(const char *input) {
  paper_t paper = parse_paper(input);
  fold_t *folds = parse_folds(input);

  for (size_t i = 0; i < dynarray_length(folds); i++)
    apply_fold(&paper, folds[i]);

#ifdef AOC_SINGLE_EXECUTABLE
  printf("\n");
  for (size_t y = 0; y < paper.height; y++) {
    for (size_t x = 0; x < paper.width; x++)
      printf(paper.dots[y][x] ? "#" : " ");
    printf("\n");
  }
  printf("\n");
#endif

  dynarray_destroy(folds);

  return 0;
}

AOC_MAIN(day13, 621, 0);
