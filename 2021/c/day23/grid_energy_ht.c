typedef struct {
  grid_t grid;
  uint32_t energy;
} grid_energy_ht_entry_t;

typedef struct {
  uint32_t hits;
  uint32_t misses;
  uint32_t comparisons;
  uint32_t size;
} grid_energy_ht_stats_t;

typedef struct {
  grid_energy_ht_entry_t *entries;
  size_t *bucket_len;
  size_t table_capacity, bucket_capacity;
  grid_energy_ht_stats_t stats;
} grid_energy_ht_t;

static bool grid_equals(grid_t *a, grid_t *b) {
  for (uint8_t i = 0; i < HALLWAY_LEN + a->per_room * TOTAL_ROOMS; i++) {
    if (a->pods[i] != b->pods[i])
      return false;
  }

  return true;
}

#define FNV_OFFSET 14695981039346656037UL
#define FNV_PRIME 1099511628211UL

static uint64_t grid_hash(grid_t *grid) {
  uint64_t hash = FNV_OFFSET;

  for (uint8_t i = 0; i < HALLWAY_LEN + grid->per_room * TOTAL_ROOMS; i++) {
    hash ^= (uint64_t)grid->pods[i];
    hash *= FNV_PRIME;
  }

  return hash;
}

grid_energy_ht_t *grid_energy_create(size_t table_capacity,
                                     size_t bucket_capacity) {
  grid_energy_ht_t *table = calloc(1, sizeof(grid_energy_ht_t));

  table->entries =
      calloc(table_capacity * bucket_capacity, sizeof(grid_energy_ht_entry_t));
  table->bucket_len = calloc(table_capacity, sizeof(size_t));
  table->table_capacity = table_capacity;
  table->bucket_capacity = bucket_capacity;

  return table;
}

void grid_energy_destroy(grid_energy_ht_t *table) {
  free(table->entries);
  free(table->bucket_len);
  free(table);
}

uint32_t grid_energy_ht_get(grid_energy_ht_t *table, grid_t *grid) {
  size_t bucket = grid_hash(grid) % table->table_capacity;

  for (size_t i = 0; i < table->bucket_len[bucket]; i++) {
    if (grid_equals(&table->entries[bucket * table->bucket_capacity + i].grid,
                    grid)) {
      table->stats.hits++;
      return table->entries[bucket * table->bucket_capacity + i].energy;
    }

    table->stats.comparisons++;
  }
  table->stats.misses++;

  return UINT32_MAX;
}

void grid_energy_ht_put(grid_energy_ht_t *table, grid_t *grid,
                        uint32_t energy) {
  size_t bucket = grid_hash(grid) % table->table_capacity;

  assert(table->bucket_len[bucket] < table->bucket_capacity);

  for (size_t i = 0; i < table->bucket_len[bucket]; i++) {
    if (grid_equals(&table->entries[bucket * table->bucket_capacity + i].grid,
                    grid)) {
      table->entries[bucket * table->bucket_capacity + i].energy = energy;
      return;
    }

    table->stats.comparisons++;
  }

  size_t idx = bucket * table->bucket_capacity + table->bucket_len[bucket];
  table->entries[idx].grid = *grid;
  table->entries[idx].energy = energy;

  table->bucket_len[bucket]++;
  table->stats.size++;
}

void grid_energy_ht_stats(grid_energy_ht_t *table) {
  printf("Cache size: %" PRIu32 "\n", table->stats.size);
  printf("Cache hits: %" PRIu32 "\n", table->stats.hits);
  printf("Cache misses: %" PRIu32 "\n", table->stats.misses);
  printf("Cache comparisons: %" PRIu32 "\n", table->stats.comparisons);

  size_t max = 0;
  for (size_t i = 0; i < table->table_capacity; i++)
    max = MAX(max, table->bucket_len[i]);
  printf("Max bucket size: %zd\n", max);
}
