#include "../shared/aoc.h"

typedef struct {
  int32_t x, y, z;
} point_t;

typedef struct {
  point_t points[1024];
  size_t size;
} pointset_t;

static pointset_t *parse_scanners(const char *input) {
  pointset_t *scanners = dynarray_create(pointset_t);
  pointset_t ps = {0};

  uint32_t read = 0, offset = 0;
  char line[1024];

  while (1 == sscanf(input + offset, "%[^\n]\n%n", line, &read)) {
    offset += read;

    if (line[0] == '\n') {
      continue;
    }

    if (line[1] == '-') {
      if (ps.size > 0) {
        dynarray_push(scanners, ps);
        memset(&ps, 0, sizeof(pointset_t));
      }

      continue;
    }

    point_t point = {0};
    sscanf(line, "%d,%d,%d", &point.x, &point.y, &point.z);
    ps.points[ps.size++] = point;
  }

  dynarray_push(scanners, ps);

  return scanners;
}

static int32_t point_sum(point_t p) { return p.x + p.y + p.z; }

static int32_t point_len_sq(point_t p) {
  return p.x * p.x + p.y * p.y + p.z * p.z;
}

static point_t point_sub(point_t a, point_t b) {
  return (point_t){a.x - b.x, a.y - b.y, a.z - b.z};
}

static point_t point_add(point_t a, point_t b) {
  return (point_t){a.x + b.x, a.y + b.y, a.z + b.z};
}

static point_t point_abs(point_t p) {
  return (point_t){abs(p.x), abs(p.y), abs(p.z)};
}

static point_t point_orient(point_t p, uint8_t ori) {
  int a = p.x, b = p.y, c = p.z;
  point_t all_orientations[24] = {
      {+a, +b, +c}, {+b, +c, +a}, {+c, +a, +b}, {+c, +b, -a}, {+b, +a, -c},
      {+a, +c, -b}, {+a, -b, -c}, {+b, -c, -a}, {+c, -a, -b}, {+c, -b, +a},
      {+b, -a, +c}, {+a, -c, +b}, {-a, +b, -c}, {-b, +c, -a}, {-c, +a, -b},
      {-c, +b, +a}, {-b, +a, +c}, {-a, +c, +b}, {-a, -b, +c}, {-b, -c, +a},
      {-c, -a, +b}, {-c, -b, -a}, {-b, -a, -c}, {-a, -c, -b}};
  return all_orientations[ori];
}

static bool pointset_exists(pointset_t *ps, point_t p) {
  for (size_t i = 0; i < ps->size; i++) {
    point_t cur = ps->points[i];
    if (cur.x == p.x && cur.y == p.y && cur.z == p.z)
      return true;
  }
  return false;
}

static void pointset_add(pointset_t *ps, point_t p) {
  if (pointset_exists(ps, p))
    return;

  ps->points[ps->size++] = p;
}

static uint8_t pointset_count_common(pointset_t *a, pointset_t *b) {
  uint8_t count = 0;

  for (size_t i = 0; i < a->size; i++)
    if (pointset_exists(b, a->points[i]))
      count++;

  return count;
}

static void pointset_orient(pointset_t *result, pointset_t *ps, uint8_t ori) {
  *result = *ps;
  for (size_t i = 0; i < result->size; i++)
    result->points[i] = point_orient(result->points[i], ori);
}

static void build_offsets(pointset_t *result, pointset_t *ps, point_t p) {
  for (size_t i = 0; i < ps->size; i++)
    result->points[i] = point_sub(ps->points[i], p);
  result->size = ps->size;
}

static void build_distances(pointset_t *result, pointset_t *ps, point_t p) {
  for (size_t i = 0; i < ps->size; i++) {
    point_t offset = {point_len_sq(point_sub(ps->points[i], p)), 0, 0};
    result->points[i] = offset;
  }
  result->size = ps->size;
}

static void update_accum_distances(pointset_t *accum,
                                   pointset_t *accum_distances) {
  for (size_t i = 0; i < accum->size; i++)
    build_distances(&accum_distances[i], accum, accum->points[i]);
}

static bool enough_common_points(pointset_t *accum, pointset_t *accum_distances,
                                 pointset_t *ps, point_t *a, point_t *b) {
  pointset_t off = {0};

  for (size_t i = 0; i < ps->size; i++) {
    point_t p2 = ps->points[i];
    build_distances(&off, ps, p2);

    for (size_t j = 0; j < accum->size; j++) {
      point_t p1 = accum->points[j];
      if (pointset_count_common(&off, &accum_distances[j]) >= 12) {
        *a = p1, *b = p2;
        return true;
      }
    }
  }

  return false;
}

static bool does_scanner_match(pointset_t *accum, pointset_t *accum_distances,
                               pointset_t *ps, point_t *result_offset,
                               uint8_t *result_ori) {
  point_t a, b;
  if (!enough_common_points(accum, accum_distances, ps, &a, &b))
    return false;

  pointset_t off1 = {0}, off2 = {0};
  build_offsets(&off1, accum, a);
  build_offsets(&off2, ps, b);

  pointset_t oriented = {0};
  for (uint8_t ori = 0; ori < 24; ori++) {
    pointset_orient(&oriented, &off2, ori);
    if (pointset_count_common(&off1, &oriented) >= 12) {
      *result_offset = point_sub(a, point_orient(b, ori));
      *result_ori = ori;
      return true;
    }
  }

  return false;
}

// locations calculated in part 1 are shared with part 2 for speed
pointset_t locations = {0};

static uint64_t part1(const char *input) {
  pointset_t *scanners = parse_scanners(input);

  pointset_t accum = scanners[0];
  pointset_t accum_distances[400] = {0};
  update_accum_distances(&accum, accum_distances);

  uint8_t aligned_total = 1, ori;
  bool scanner_aligned[25] = {true};

  for (size_t i = 0; aligned_total < dynarray_length(scanners);
       i = (i + 1) % dynarray_length(scanners)) {
    if (scanner_aligned[i])
      continue;

    point_t offset;
    pointset_t current = scanners[i];
    if (does_scanner_match(&accum, accum_distances, &current, &offset, &ori)) {
      pointset_add(&locations, offset);

      for (size_t j = 0; j < current.size; j++) {
        point_t p = current.points[j];
        pointset_add(&accum, point_add(point_orient(p, ori), offset));
      }

      update_accum_distances(&accum, accum_distances);
      scanner_aligned[i] = true;
      aligned_total++;
    }
  }

  dynarray_destroy(scanners);

  return accum.size;
}

static uint64_t part2(const char *input) {
  uint64_t max_distance = 0;

  for (size_t i = 0; i < locations.size; i++) {
    for (size_t j = 0; j < locations.size; j++) {
      int32_t distance = point_sum(
          point_abs(point_sub(locations.points[i], locations.points[j])));
      max_distance = MAX(max_distance, distance);
    }
  }

  return max_distance;
}

AOC_MAIN(day19, 315, 13192);
