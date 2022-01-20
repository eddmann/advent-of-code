#include "../shared/aoc.h"

#define NIL 0

static uint32_t to_dec(const char *bin) {
  uint32_t dec = 0;

  while (*bin) {
    dec *= 2;
    dec += *bin == '1' ? 1 : 0;
    bin++;
  }

  return dec;
}

static uint32_t *parse_diagnostic_report(const char *input) {
  uint32_t *diagnostic_report = dynarray_create(uint32_t);

  char bin[13];
  uint32_t offset = 0, read = 0;

  while (1 == sscanf(input + offset, "%s\n%n", bin, &read)) {
    uint32_t dec = to_dec(bin);
    dynarray_push(diagnostic_report, dec);
    offset += read;
  }

  return diagnostic_report;
}

static int32_t bit_width(uint32_t *diagnostic_report) {
  int32_t width = 0;

  for (size_t i = 0; i < dynarray_length(diagnostic_report); i++) {
    int32_t msb = 0;

#ifdef AOC_PICO
    uint32_t report = diagnostic_report[i];
    while (report >>= 1)
      msb++;
#else
    asm("bsrl %1,%0" : "=r"(msb) : "r"(diagnostic_report[i]));
#endif

    width = MAX(width, msb);
  }

  return width;
}

static uint32_t first_value(uint32_t *diagnostic_report) {
  for (size_t i = 0; i < dynarray_length(diagnostic_report); i++) {
    if (diagnostic_report[i] != NIL) {
      return diagnostic_report[i];
    }
  }

  return 0;
}

static uint8_t common_bit(uint32_t *diagnostic_report, uint8_t bit_position,
                          bool is_msb) {
  uint16_t zeros = 0, ones = 0;

  for (int i = 0; i < dynarray_length(diagnostic_report); i++) {
    if (diagnostic_report[i] == NIL)
      continue;

    if (diagnostic_report[i] >> bit_position & 1) {
      ones += 1;
    } else {
      zeros += 1;
    }
  }

  if (is_msb) {
    return ones == zeros ? 1 : ones > zeros;
  }

  return ones == zeros ? 0 : ones < zeros;
}

#define msb(diagnostic_report, bit_position)                                   \
  common_bit(diagnostic_report, bit_position, true)
#define lsb(diagnostic_report, bit_position)                                   \
  common_bit(diagnostic_report, bit_position, false)

static uint64_t part1(const char *input) {
  uint32_t *diagnostic_report = parse_diagnostic_report(input);

  uint32_t gamma_rate = 0, epsilon_rate = 0;

  for (int32_t i = bit_width(diagnostic_report); i >= 0; i--) {
    if (msb(diagnostic_report, i)) {
      gamma_rate |= 1 << i;
    } else {
      epsilon_rate |= 1 << i;
    }
  }

  dynarray_destroy(diagnostic_report);

  return gamma_rate * epsilon_rate;
}

static uint64_t part2(const char *input) {
  uint32_t *oxygen = parse_diagnostic_report(input);
  size_t oxygen_len = dynarray_length(oxygen);

  uint32_t *co2 = parse_diagnostic_report(input);
  size_t co2_len = dynarray_length(co2);

  for (int32_t i = bit_width(oxygen); i >= 0; i--) {
    if (oxygen_len > 1) {
      uint8_t oxygen_bit = msb(oxygen, i);

      for (size_t j = 0; j < dynarray_length(oxygen); j++) {
        if (oxygen[j] == NIL)
          continue;
        if ((oxygen[j] >> i & 1) != oxygen_bit) {
          oxygen[j] = NIL;
          oxygen_len--;
        }
      }
    }

    if (co2_len > 1) {
      uint8_t co2_bit = lsb(co2, i);

      for (size_t j = 0; j < dynarray_length(co2); j++) {
        if (co2[j] == NIL)
          continue;
        if ((co2[j] >> i & 1) != co2_bit) {
          co2[j] = NIL;
          co2_len--;
        }
      }
    }
  }

  uint64_t result = first_value(oxygen) * first_value(co2);

  dynarray_destroy(oxygen);
  dynarray_destroy(co2);

  return result;
}

AOC_MAIN(day03, 3242606, 4856080);
