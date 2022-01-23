#include "../shared/aoc.h"

// idea borrowed from
// https://www.reddit.com/r/adventofcode/comments/rl6p8y/comment/hpet9io/

static void parse_player_positions(const char *input, uint32_t *p1,
                                   uint32_t *p2) {
  sscanf(input,
         "Player 1 starting position: %" SCNu32
         "\nPlayer 2 starting position: %" SCNu32,
         p1, p2);
}

static inline void swap(uint32_t *a, uint32_t *b) {
  *a = *a ^ *b;
  *b = *a ^ *b;
  *a = *a ^ *b;
}

#define MAX_GAMES 11
#define WINNING_SCORE 21

typedef struct {
  uint64_t wins[MAX_GAMES];
  uint64_t loss[MAX_GAMES];
} game_results_t;

static game_results_t *quantum_game_results(uint32_t initial_pos) {
  const uint8_t ROLL_PROBABILITY[] = {1, 3, 6, 7, 6, 3, 1};

  uint64_t table[MAX_GAMES][MAX_GAMES][22] = {0};
  table[0][initial_pos][0] = 1;

  for (uint8_t player_a = 1; player_a < MAX_GAMES; player_a++) {
    for (uint8_t player_b = 1; player_b < MAX_GAMES; player_b++) {
      for (uint8_t score = 0; score < WINNING_SCORE; score++) {
        for (uint8_t roll = 0; roll < 7; roll++) {
          uint64_t q = ((player_b + roll + 2) % 10) + 1;
          uint64_t v = MIN(q + score, WINNING_SCORE);
          table[player_a][q][v] +=
              ROLL_PROBABILITY[roll] * table[player_a - 1][player_b][score];
        }
      }
    }
  }

  game_results_t *results = calloc(1, sizeof(game_results_t));

  for (uint8_t player_a = 0; player_a < MAX_GAMES; player_a++) {
    for (uint8_t player_b = 0; player_b < MAX_GAMES; player_b++) {
      for (uint8_t score = 0; score < WINNING_SCORE; score++) {
        results->loss[player_a] += table[player_a][player_b][score];
      }
      results->wins[player_a] += table[player_a][player_b][WINNING_SCORE];
    }
  }

  return results;
}

static uint64_t part1(const char *input) {
  uint32_t curr_pos = 0, prev_pos = 0;
  parse_player_positions(input, &curr_pos, &prev_pos);

  uint32_t curr_score = 0, prev_score = 0;
  uint8_t die_num = 6;
  uint32_t die_rolls = 0;

  while (prev_score < 1000) {
    curr_pos = (curr_pos + die_num) % 10;
    curr_score += curr_pos == 0 ? 10 : curr_pos;

    swap(&curr_pos, &prev_pos);
    swap(&curr_score, &prev_score);

    die_rolls += 3;
    die_num = die_num == 0 ? 9 : die_num - 1;
  }

  return curr_score * die_rolls;
}

static uint64_t part2(const char *input) {
  uint32_t p1_pos = 0, p2_pos = 0;
  parse_player_positions(input, &p1_pos, &p2_pos);

  game_results_t *p1_results = quantum_game_results(p1_pos);
  game_results_t *p2_results = quantum_game_results(p2_pos);

  uint64_t p1_score = 0, p2_score = 0;

  for (uint8_t i = 1; i < MAX_GAMES; i++) {
    p1_score += p1_results->wins[i] * p2_results->loss[i - 1];
    p2_score += p2_results->wins[i - 1] * p1_results->loss[i - 1];
  }

  free(p1_results);
  free(p2_results);

  return MAX(p1_score, p2_score);
}

AOC_MAIN(day21, 711480, 265845890886828);
