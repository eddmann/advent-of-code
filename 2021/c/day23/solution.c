#include "../shared/aoc.h"

/*
Representation:

####################################
# .0 .1 .2 .3 .4 .5 .6 .7 .8 .9 10 #
####### 11 ## 15 ## 19 ## 23 #######
      # 12 ## 16 ## 20 ## 24 #
      # 13 ## 17 ## 21 ## 25 #
      # 14 ## 18 ## 22 ## 26 #
      ########################

States: empty = 0, A = 1, B = 2, C = 3, D = 4
Room entrances (2, 4, 6, 8) are always empty as problem states.

Insight:
- Only performs moves from a room into the hallway OR from the hallway into a room.
- Prunes superfluous additional moves where the hallway position is between the room and target room, leaving only one.
- Applies A* with a lower-bound heuristic that calculates the cost as if every pod could move through each other to be placed in the correct room.
- Uses a hash-table with a fixed memory size of 10,000 buckets, 50 bucket cap; this has been tuned based on the provided input.
*/

#define HALLWAY_LEN 11
#define TOTAL_ROOMS 4
#define MAX_ROOM_CAP 4

#define MAX_MOVES_CAP 26
#define HT_BUCKET_NUM 10000
#define HT_BUCKET_CAP 50

static uint16_t AMPHIPOD_ENERGY_COST[TOTAL_ROOMS] = {1, 10, 100, 1000};

typedef struct {
  uint8_t pods[HALLWAY_LEN + TOTAL_ROOMS * MAX_ROOM_CAP];
  uint8_t per_room;
} grid_t;

typedef struct {
  uint8_t from, to, steps;
} move_t;

#include "grid_energy_ht.c"
#include "grid_energy_pq.c"

static grid_t *parse_grid(const char *input, uint8_t per_room) {
  grid_t *grid = calloc(1, sizeof(grid_t));
  grid->per_room = per_room;

  for (uint8_t i = 0, pod = 0; input[i] != '\0'; i++) {
    if ('A' <= input[i] && input[i] <= 'D') {
      grid->pods[HALLWAY_LEN + per_room * (pod % TOTAL_ROOMS) +
                 pod / TOTAL_ROOMS] = input[i] - 'A' + 1;
      pod++;
    }
  }

  return grid;
}

static inline uint8_t room_offset(grid_t *grid, uint8_t room) {
  return HALLWAY_LEN + room * grid->per_room;
}

#ifdef AOC_SINGLE_EXECUTABLE
static void print_grid(grid_t *grid) {
  char display[7][14] = {"#############", "#...........#", "###.#.#.#.###",
                         "  #.#.#.#.#  ", "  #.#.#.#.#  ", "  #.#.#.#.#  ",
                         "  #########  "};

  for (uint8_t hallway = 0; hallway < HALLWAY_LEN; hallway++) {
    display[1][hallway + 1] =
        (grid->pods[hallway] > 0 ? 'A' + (grid->pods[hallway] - 1) : '.');
  }

  for (uint8_t room = 0; room < TOTAL_ROOMS; room++) {
    for (uint8_t entry = 0; entry < grid->per_room; entry++) {
      uint8_t item = room_offset(grid, room) + entry;
      display[2 + entry][3 + 2 * room] =
          (grid->pods[item] > 0 ? 'A' + (grid->pods[item] - 1) : '.');
    }
  }

  for (uint8_t i = 0; i < 7; i++) {
    if (grid->per_room == 2 && (4 <= i && i <= 5))
      continue;
    printf("%s\n", display[i]);
  }
}
#endif

static bool is_organised(grid_t *grid) {
  for (uint8_t i = 0; i < HALLWAY_LEN + (grid->per_room * TOTAL_ROOMS) - 1;
       i++) {
    if (grid->pods[i] > grid->pods[i + 1])
      return false;
  }

  return true;
}

static bool moveable_room_entry(grid_t *grid, uint8_t room, uint8_t *room_entry,
                                uint8_t *target_room) {
  for (uint8_t entry = 0; entry < grid->per_room; entry++) {
    if (grid->pods[room_offset(grid, room) + entry] > 0) {
      *room_entry = entry;
      *target_room = grid->pods[room_offset(grid, room) + entry] - 1;
      return true;
    }
  }

  return false;
}

static bool has_direct_route(uint8_t hallway, uint8_t room,
                             uint8_t target_room) {
  uint8_t from = MIN(2 + 2 * room, 2 + 2 * target_room);
  uint8_t to = MAX(2 + 2 * room, 2 + 2 * target_room);

  return from < hallway && hallway < to;
}

static inline uint8_t steps_between(uint8_t hallway, uint8_t room) {
  return abs(hallway - (2 + 2 * room)) + 1;
}

static bool has_clear_path(grid_t *grid, uint8_t hallway, uint8_t room) {
  uint8_t from = MIN(hallway, 2 + 2 * room);
  uint8_t to = MAX(hallway, 2 + 2 * room);

  for (uint8_t step = from; step < to; step++) {
    if (step != hallway && grid->pods[step] != 0) {
      return false;
    }
  }

  return true;
}

static bool can_enter_room(grid_t *grid, uint8_t room) {
  for (uint8_t entry = 0; entry < grid->per_room; entry++) {
    if (grid->pods[room_offset(grid, room) + entry] != 0 &&
        grid->pods[room_offset(grid, room) + entry] != room + 1) {
      return false;
    }
  }

  return true;
}

static void next_room_moves(grid_t *grid, move_t *moves, uint8_t *moves_len,
                            uint8_t hallway, uint8_t room) {

  if (!can_enter_room(grid, room) || !has_clear_path(grid, hallway, room)) {
    return;
  }

  uint8_t entry, target_room;
  uint8_t vacancy = moveable_room_entry(grid, room, &entry, &target_room)
                        ? entry - 1
                        : grid->per_room - 1;

  moves[(*moves_len)++] = (move_t){hallway, room_offset(grid, room) + vacancy,
                                   steps_between(hallway, room) + vacancy};
}

static void next_hallway_moves(grid_t *grid, move_t *moves, uint8_t *moves_len,
                               uint8_t hallway, uint8_t room) {
  uint8_t entry, target_room;
  if (!moveable_room_entry(grid, room, &entry, &target_room)) {
    return;
  }

  if (!has_clear_path(grid, hallway, room))
    return;

  bool is_direct = has_direct_route(hallway, room, target_room);
  uint8_t steps = steps_between(hallway, room);
  if (is_direct && steps > 2)
    return;

  moves[(*moves_len)++] =
      (move_t){room_offset(grid, room) + entry, hallway, steps + entry};
}

static void next_moves(grid_t *grid, move_t *moves, uint8_t *moves_len) {
  for (uint8_t hallway = 0; hallway < HALLWAY_LEN; hallway++) {
    if (hallway == 2 || hallway == 4 || hallway == 6 || hallway == 8)
      continue;

    if (grid->pods[hallway] > 0) {
      next_room_moves(grid, moves, moves_len, hallway, grid->pods[hallway] - 1);
      continue;
    }

    for (uint8_t room = 0; room < TOTAL_ROOMS; room++)
      next_hallway_moves(grid, moves, moves_len, hallway, room);
  }
}

static uint32_t energy_required_heuristic(grid_t *grid) {
  uint32_t energy = 0;
  uint8_t unorganised_pods[TOTAL_ROOMS] = {0};

  for (uint8_t hallway = 0; hallway < HALLWAY_LEN; hallway++) {
    if (grid->pods[hallway] == 0)
      continue;

    uint8_t target_room = grid->pods[hallway] - 1;
    unorganised_pods[target_room] += 1;
    uint8_t steps = abs(hallway - (2 + 2 * target_room));
    energy += steps * AMPHIPOD_ENERGY_COST[target_room];
  }

  for (uint8_t room = 0; room < TOTAL_ROOMS; room++) {
    for (uint8_t entry = 0; entry < grid->per_room; entry++) {
      if (grid->pods[room_offset(grid, room) + entry] == 0)
        continue;

      uint8_t target_room = grid->pods[room_offset(grid, room) + entry] - 1;

      if (entry == target_room)
        continue;

      unorganised_pods[target_room] += 1;
      uint8_t room_exit_steps = entry + 1;
      uint8_t hallways_steps = 2 * abs(room - target_room) + 1;
      energy += (room_exit_steps + hallways_steps) *
                AMPHIPOD_ENERGY_COST[target_room];
    }
  }

  for (uint8_t room = 0; room < TOTAL_ROOMS; room++) {
    energy += unorganised_pods[room] * (unorganised_pods[room] + 1) / 2 *
              AMPHIPOD_ENERGY_COST[room - 1];
  }

  return energy;
}

static uint32_t least_energy_to_organise(grid_t *grid) {
  grid_energy_ht_t *table = grid_energy_create(HT_BUCKET_NUM, HT_BUCKET_CAP);

  grid_energy_pq_t *queue = pq_create();
  grid_energy_pq_enqueue(queue, 0, grid, 0);

  uint32_t energy = 0;

  while (queue->length > 0) {
    grid_energy_pq_item_t item = grid_energy_pq_dequeue(queue);

    if (is_organised(&item.grid)) {
      energy = item.energy;
      goto organised;
    }

    if (item.energy > grid_energy_ht_get(table, &item.grid)) {
      continue;
    }

    move_t moves[MAX_MOVES_CAP];
    uint8_t moves_len = 0;
    next_moves(&item.grid, moves, &moves_len);

    for (uint8_t i = 0; i < moves_len; i++) {
      move_t move = moves[i];

      grid_t next_grid = item.grid;
      next_grid.pods[move.to] = next_grid.pods[move.from];
      next_grid.pods[move.from] = 0;

      uint32_t next_energy =
          item.energy +
          move.steps * AMPHIPOD_ENERGY_COST[next_grid.pods[move.to] - 1];

      if (next_energy < grid_energy_ht_get(table, &next_grid)) {
        grid_energy_ht_put(table, &next_grid, next_energy);
        grid_energy_pq_enqueue(
            queue, next_energy + energy_required_heuristic(&next_grid),
            &next_grid, next_energy);
      }
    }
  }

organised:
#ifdef AOC_SINGLE_EXECUTABLE
  grid_energy_ht_stats(table);
#endif

  grid_energy_destroy(table);

  return energy;
}

static uint64_t part1(const char *input) {
  grid_t *grid = parse_grid(input, 2);

#ifdef AOC_SINGLE_EXECUTABLE
  print_grid(grid);
#endif

  return least_energy_to_organise(grid);
}

static uint64_t part2(const char *input) {
  char addition[24] = "  #D#C#B#A#\n  #D#B#A#C#\n";
  char expanded_input[90];
  memcpy(expanded_input, input, 42);
  memcpy(expanded_input + 42, addition, 24);
  memcpy(expanded_input + 42 + 24, input + 42, 23);
  expanded_input[89] = '\0';

  grid_t *grid = parse_grid(expanded_input, 4);

#ifdef AOC_SINGLE_EXECUTABLE
  print_grid(grid);
#endif

  return least_energy_to_organise(grid);
}

AOC_MAIN(day23, 18195, 50265);
