#include "../shared/aoc.h"
#include <stdbool.h>
#include <stdint.h>
#include <stdlib.h>
#include <string.h>

#define MAX_IMAGE_SIZE 200

typedef struct {
  bool algorithm[512];
  bool pixels[MAX_IMAGE_SIZE][MAX_IMAGE_SIZE];
  uint16_t size;
  bool default_value;
} image_t;

static image_t parse_image(const char *input) {
  image_t image = {0};

  size_t offset = 0;

  for (; offset < 512; offset++)
    image.algorithm[offset] = input[offset] == '#';

  offset += 2; // new lines

  size_t col = 0;
  while (input[offset] != '\0') {
    if (input[offset] == '\n') {
      offset += 1;
      image.size += 1;
      col = 0;
      continue;
    }

    image.pixels[image.size][col++] = input[offset++] == '#';
  }

  image.size += 1;

  return image;
}

static bool enhance_pixel(image_t *image, int16_t x, int16_t y) {
  static int8_t directions[9][2] = {{-1, -1}, {-1, 0}, {-1, 1}, {0, -1}, {0, 0},
                                    {0, 1},   {1, -1}, {1, 0},  {1, 1}};

  size_t index = 0;

  for (size_t d = 0; d < 9; d++) {
    int16_t nx = x + directions[d][1];
    int16_t ny = y + directions[d][0];

    int8_t pixel = (nx < 0 || nx >= image->size || ny < 0 || ny >= image->size)
                       ? image->default_value
                       : image->pixels[ny][nx];

    index = index << 1 | pixel;
  }

  return image->algorithm[index];
}

static void enhance(image_t *image) {
  bool next_pixels[MAX_IMAGE_SIZE][MAX_IMAGE_SIZE] = {0};

  for (int16_t y = -1; y <= image->size; y++) {
    for (int16_t x = -1; x <= image->size; x++) {
      next_pixels[y + 1][x + 1] = enhance_pixel(image, x, y);
    }
  }

  image->size += 2;
  memcpy(image->pixels, next_pixels, sizeof(image->pixels));

  if (image->algorithm[0]) {
    image->default_value = !image->default_value;
  }
}

static uint64_t total_lit_pixels(image_t image) {
  uint64_t total = 0;

  for (size_t y = 0; y < image.size; y++) {
    for (size_t x = 0; x < image.size; x++) {
      total += image.pixels[y][x];
    }
  }

  return total;
}

uint64_t day20_part1(const char *input) {
  image_t image = parse_image(input);

  for (int i = 0; i < 2; i++)
    enhance(&image);

  return total_lit_pixels(image);
}

uint64_t day20_part2(const char *input) {
  image_t image = parse_image(input);

  for (int i = 0; i < 50; i++)
    enhance(&image);

  return total_lit_pixels(image);
}

AOC_MAIN(day20, 5275, 16482);
