#include "../shared/aoc.h"
#include "../shared/dynarray.h"
#include <stdbool.h>
#include <stdint.h>
#include <stdlib.h>

#define STAMPED 255
#define GRID_SIZE 5

static uint8_t *parse_numbers(const char *input, size_t *offset) {
  uint8_t *numbers = dynarray_create(uint8_t);

  uint8_t number;
  size_t read = 0;
  while (1 == sscanf(input + (*offset), "%" SCNu8 "%n", &number, &read)) {
    dynarray_push(numbers, number);
    *offset += read + 1;
    if (input[*offset - 1] != ',') {
      break;
    }
  }

  return numbers;
}

static uint8_t *parse_board(const char *input, size_t *offset) {
  uint8_t *board = dynarray_create(uint8_t);

  uint8_t number;
  size_t read = 0;
  while (1 == sscanf(input + (*offset), "%" SCNu8 "%n", &number, &read)) {
    dynarray_push(board, number);
    *offset += read + 1;
    if (input[*offset - 1] == '\n' && input[*offset] == '\n') {
      break;
    }
  }

  return board;
}

static uint8_t **parse_boards(const char *input, size_t *offset) {
  uint8_t **boards = dynarray_create(uint8_t *);

  while (input[*offset] != '\0') {
    uint8_t *board = parse_board(input, offset);
    dynarray_push(boards, board);
  }

  return boards;
}

static void stamp_if_found(uint8_t *board, uint8_t number) {
  for (size_t i = 0; i < dynarray_length(board); i++) {
    if (board[i] == number) {
      board[i] = STAMPED;
    }
  }
}

static bool is_winning_col(uint8_t *board, size_t col) {
  for (size_t i = 0; i < GRID_SIZE; i++) {
    if (board[i * GRID_SIZE + col] != STAMPED) {
      return false;
    }
  }

  return true;
}

static bool is_winning_row(uint8_t *board, size_t row) {
  for (size_t i = 0; i < GRID_SIZE; i++) {
    if (board[GRID_SIZE * row + i] != STAMPED) {
      return false;
    }
  }

  return true;
}

static bool is_winner(uint8_t *board) {
  for (size_t i = 0; i < dynarray_length(board); i++) {
    if (is_winning_col(board, i) || is_winning_row(board, i)) {
      return true;
    }
  }

  return false;
}

static bool is_all_winners(uint8_t **boards) {
  for (size_t i = 0; i < dynarray_length(boards); i++) {
    if (!is_winner(boards[i])) {
      return false;
    }
  }

  return true;
}

static uint32_t sum_unstamped_numbers(uint8_t *board) {
  uint32_t sum = 0;

  for (size_t i = 0; i < dynarray_length(board); i++) {
    if (board[i] != STAMPED) {
      sum += board[i];
    }
  }

  return sum;
}

uint32_t day04_part1(const char *input) {
  size_t offset = 0;
  uint8_t *numbers = parse_numbers(input, &offset);
  uint8_t **boards = parse_boards(input, &offset);

  uint32_t score = 0;

  for (size_t i = 0; i < dynarray_length(numbers); i++) {
    uint8_t number = numbers[i];

    for (size_t j = 0; j < dynarray_length(boards); j++) {
      uint8_t *board = boards[j];

      stamp_if_found(board, number);

      if (is_winner(board)) {
        score = number * sum_unstamped_numbers(board);
        goto score;
      }
    }
  }

score:
  dynarray_destroy(numbers);
  for (size_t i = 0; i < dynarray_length(boards); i++)
    dynarray_destroy(boards[i]);
  dynarray_destroy(boards);

  return score;
}

uint32_t day04_part2(const char *input) {
  size_t offset = 0;
  uint8_t *numbers = parse_numbers(input, &offset);
  uint8_t **boards = parse_boards(input, &offset);

  uint32_t score = 0;

  for (size_t i = 0; i < dynarray_length(numbers); i++) {
    uint8_t number = numbers[i];

    for (size_t j = 0; j < dynarray_length(boards); j++) {
      uint8_t *board = boards[j];

      stamp_if_found(board, number);

      if (is_all_winners(boards)) {
        score = number * sum_unstamped_numbers(board);
        goto score;
      }
    }
  }

score:
  dynarray_destroy(numbers);
  for (size_t i = 0; i < dynarray_length(boards); i++)
    dynarray_destroy(boards[i]);
  dynarray_destroy(boards);

  return score;
}

AOC_MAIN(day04, 60368, 17435);
