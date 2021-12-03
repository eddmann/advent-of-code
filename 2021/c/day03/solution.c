#include "../shared/aoc.h"
#include "../shared/dynarray.h"
#include <stdlib.h>

#define NIL 0

int to_dec(char *bin) {
  int dec = 0;

  while (*bin) {
    dec *= 2;
    dec += *bin == '1' ? 1 : 0;
    bin++;
  }

  return dec;
}

int *parse_diagnostic_report(char *input) {
  int *diagnostic_report = dynarray_create(int);

  char bin[13];
  int offset = 0, read = 0;
  while (1 == sscanf(input + offset, "%s\n%n", bin, &read)) {
    int dec = to_dec(bin);
    dynarray_push(diagnostic_report, dec);
    offset += read;
  }

  return diagnostic_report;
}

int bit_width(int *diagnostic_report) {
  int width = 0;

  for (int i = 0; i < dynarray_length(diagnostic_report); i++) {
    int msb;
    asm("bsrl %1,%0" : "=r"(msb) : "r"(diagnostic_report[i]));
    if (msb > width) {
      width = msb;
    }
  }

  return width;
}

int first_value(int *diagnostic_report) {
  for (int i = 0; i < dynarray_length(diagnostic_report); i++) {
    if (diagnostic_report[i] != NIL) {
      return diagnostic_report[i];
    }
  }
}

int common_bit(int *diagnostic_report, int bit_position, int is_msb) {
  int zeros = 0, ones = 0;

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
  common_bit(diagnostic_report, bit_position, 1)
#define lsb(diagnostic_report, bit_position)                                   \
  common_bit(diagnostic_report, bit_position, 0)

int part1(char *input) {
  int *diagnostic_report = parse_diagnostic_report(input);

  int gamma_rate = 0, epsilon_rate = 0;

  for (int i = bit_width(diagnostic_report); i >= 0; i--) {
    if (msb(diagnostic_report, i)) {
      gamma_rate |= 1 << i;
    } else {
      epsilon_rate |= 1 << i;
    }
  }

  dynarray_destroy(diagnostic_report);

  return gamma_rate * epsilon_rate;
}

int part2(char *input) {
  int *oxygen = parse_diagnostic_report(input);
  int oxygen_len = dynarray_length(oxygen);

  int *co2 = parse_diagnostic_report(input);
  int co2_len = dynarray_length(co2);

  for (int i = bit_width(oxygen); i >= 0; i--) {
    if (oxygen_len > 1) {
      int oxygen_bit = msb(oxygen, i);

      for (int j = 0; j < dynarray_length(oxygen); j++) {
        if (oxygen[j] == NIL)
          continue;
        if ((oxygen[j] >> i & 1) != oxygen_bit) {
          oxygen[j] = NIL;
          oxygen_len--;
        }
      }
    }

    if (co2_len > 1) {
      int co2_bit = lsb(co2, i);

      for (int j = 0; j < dynarray_length(co2); j++) {
        if (co2[j] == NIL)
          continue;
        if ((co2[j] >> i & 1) != co2_bit) {
          co2[j] = NIL;
          co2_len--;
        }
      }
    }
  }

  dynarray_destroy(oxygen);
  dynarray_destroy(co2);

  return first_value(oxygen) * first_value(co2);
}

AOC_MAIN();
