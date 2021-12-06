#include "../shared/aoc.h"
#include "../shared/dynarray.h"
#include <stdbool.h>
#include <stdlib.h>

#define STAMPED -1
#define GRID_SIZE 5

int *parse_numbers(char *input, int *offset) {
  int *numbers = dynarray_create(int);

  int number, read;
  while (1 == sscanf(input + (*offset), "%d%n", &number, &read)) {
    dynarray_push(numbers, number);
    *offset += read + 1;
    if (input[*offset - 1] != ',') {
      break;
    }
  }

  return numbers;
}

int *parse_board(char *input, int *offset) {
  int *board = dynarray_create(int);

  int number, read;
  while (1 == sscanf(input + (*offset), "%d%n", &number, &read)) {
    dynarray_push(board, number);
    *offset += read + 1;
    if (input[*offset - 1] == '\n' && input[*offset] == '\n') {
      break;
    }
  }

  return board;
}

int **parse_boards(char *input, int *offset) {
  int **boards = dynarray_create(int *);

  while (input[*offset] != '\0') {
    int *board = parse_board(input, offset);
    dynarray_push(boards, board);
  }

  return boards;
}

void stamp_if_found(int *board, int number) {
  for (int i = 0; i < dynarray_length(board); i++) {
    if (board[i] == number) {
      board[i] = STAMPED;
    }
  }
}

bool is_winning_col(int *board, int col) {
  for (int i = 0; i < GRID_SIZE; i++) {
    if (board[i * GRID_SIZE + col] != STAMPED) {
      return false;
    }
  }

  return true;
}

bool is_winning_row(int *board, int row) {
  for (int i = 0; i < GRID_SIZE; i++) {
    if (board[GRID_SIZE * row + i] != STAMPED) {
      return false;
    }
  }

  return true;
}

bool is_winner(int *board) {
  for (int i = 0; i < dynarray_length(board); i++) {
    if (is_winning_col(board, i) || is_winning_row(board, i)) {
      return true;
    }
  }

  return false;
}

bool is_all_winners(int **boards) {
  for (int i = 0; i < dynarray_length(boards); i++) {
    if (!is_winner(boards[i])) {
      return false;
    }
  }

  return true;
}

int sum_unstamped_numbers(int *board) {
  int sum = 0;

  for (int i = 0; i < dynarray_length(board); i++) {
    if (board[i] != STAMPED) {
      sum += board[i];
    }
  }

  return sum;
}

int day04_part1(char *input) {
  int offset = 0;
  int *numbers = parse_numbers(input, &offset);
  int **boards = parse_boards(input, &offset);

  int score = 0;

  for (int i = 0; i < dynarray_length(numbers); i++) {
    int number = numbers[i];

    for (int j = 0; j < dynarray_length(boards); j++) {
      int *board = boards[j];

      stamp_if_found(board, number);

      if (is_winner(board)) {
        score = number * sum_unstamped_numbers(board);
        goto score;
      }
    }
  }

score:
  dynarray_destroy(numbers);
  for (int i = 0; i < dynarray_length(boards); i++) {
    dynarray_destroy(boards[i]);
  }
  dynarray_destroy(boards);

  return score;
}

int day04_part2(char *input) {
  int offset = 0;
  int *numbers = parse_numbers(input, &offset);
  int **boards = parse_boards(input, &offset);

  int score = 0;

  for (int i = 0; i < dynarray_length(numbers); i++) {
    int number = numbers[i];

    for (int j = 0; j < dynarray_length(boards); j++) {
      int *board = boards[j];

      stamp_if_found(board, number);

      if (is_all_winners(boards)) {
        score = number * sum_unstamped_numbers(board);
        goto score;
      }
    }
  }

score:
  dynarray_destroy(numbers);
  for (int i = 0; i < dynarray_length(boards); i++) {
    dynarray_destroy(boards[i]);
  }
  dynarray_destroy(boards);

  return score;
}

AOC_MAIN(day04);
