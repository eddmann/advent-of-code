typedef struct {
  uint32_t cost;
  grid_t grid;
  uint32_t energy;
} grid_energy_pq_item_t;

typedef struct {
  grid_energy_pq_item_t *items;
  uint32_t length, size;
} grid_energy_pq_t;

grid_energy_pq_t *pq_create() { return calloc(1, sizeof(grid_energy_pq_t)); }

void grid_energy_pq_enqueue(grid_energy_pq_t *queue, uint32_t cost,
                            grid_t *grid, uint32_t energy) {
  if (queue->length + 1 >= queue->size) {
    queue->size = queue->size ? queue->size * 2 : 4;
    queue->items = (grid_energy_pq_item_t *)realloc(
        queue->items, queue->size * sizeof(grid_energy_pq_item_t));
  }

  uint32_t i = queue->length + 1;
  uint32_t j = i / 2;

  while (i > 1 && queue->items[j].cost > cost) {
    queue->items[i] = queue->items[j];
    i = j;
    j = j / 2;
  }

  queue->items[i].cost = cost;
  queue->items[i].grid = *grid;
  queue->items[i].energy = energy;
  queue->length++;
}

grid_energy_pq_item_t grid_energy_pq_dequeue(grid_energy_pq_t *queue) {
  grid_energy_pq_item_t item = queue->items[1];

  queue->items[1] = queue->items[queue->length];
  queue->length--;

  uint32_t i = 1;
  while (i != queue->length + 1) {
    uint32_t k = queue->length + 1;
    uint32_t j = 2 * i;
    if (j <= queue->length && queue->items[j].cost < queue->items[k].cost)
      k = j;
    if (j + 1 <= queue->length &&
        queue->items[j + 1].cost < queue->items[k].cost)
      k = j + 1;
    queue->items[i] = queue->items[k];
    i = k;
  }

  return item;
}
