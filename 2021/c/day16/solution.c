#include "../shared/aoc.h"
#include <stdint.h>
#include <stdlib.h>

typedef struct {
  char *stream;
  uint16_t pos;
} bitstream_t;

typedef struct packet {
  uint8_t version;
  uint8_t type;
  uint64_t value;
  struct packet **subpackets;
  uint8_t num_subpackets;
} packet_t;

bitstream_t *create_bitstream(const char *input) {
  bitstream_t *bitstream = calloc(1, sizeof(bitstream_t));
  bitstream->stream = calloc(1, 1315 * 4);

  uint16_t pos = 0;
  char *stream = bitstream->stream;

  while (input[pos] != '\0') {
    switch (input[pos]) {
    case '0':
      sprintf(stream, "0000");
      break;
    case '1':
      sprintf(stream, "0001");
      break;
    case '2':
      sprintf(stream, "0010");
      break;
    case '3':
      sprintf(stream, "0011");
      break;
    case '4':
      sprintf(stream, "0100");
      break;
    case '5':
      sprintf(stream, "0101");
      break;
    case '6':
      sprintf(stream, "0110");
      break;
    case '7':
      sprintf(stream, "0111");
      break;
    case '8':
      sprintf(stream, "1000");
      break;
    case '9':
      sprintf(stream, "1001");
      break;
    case 'A':
      sprintf(stream, "1010");
      break;
    case 'B':
      sprintf(stream, "1011");
      break;
    case 'C':
      sprintf(stream, "1100");
      break;
    case 'D':
      sprintf(stream, "1101");
      break;
    case 'E':
      sprintf(stream, "1110");
      break;
    case 'F':
      sprintf(stream, "1111");
      break;
    default:
      exit(1);
    }

    pos += 1;
    stream += 4;
  }

  *stream = '\0';

  return bitstream;
}

uint16_t parse_uint(bitstream_t *bitstream, uint8_t num_bits) {
  uint16_t res = 0;
  for (uint8_t i = 0; i < num_bits; i++)
    res = res * 2 + (bitstream->stream[bitstream->pos + i] - '0');

  bitstream->pos += num_bits;

  return res;
}

packet_t *parse_packet(bitstream_t *bitstream) {
  packet_t *packet = calloc(1, sizeof(packet_t));

  packet->version = parse_uint(bitstream, 3);
  packet->type = parse_uint(bitstream, 3);

  if (packet->type == 4) {
    uint8_t has_bit = 1;
    while (has_bit) {
      has_bit = parse_uint(bitstream, 1);
      packet->value = packet->value << 4 | parse_uint(bitstream, 4);
    }

    return packet;
  }

  int bit_mode = parse_uint(bitstream, 1);

  if (bit_mode == 0) {
    uint8_t length = parse_uint(bitstream, 15);

    while (length > 0) {
      uint16_t old_pos = bitstream->pos;
      packet_t *subpacket = parse_packet(bitstream);
      packet->subpackets =
          realloc(packet->subpackets,
                  (packet->num_subpackets + 1) * sizeof(packet_t *));
      packet->subpackets[packet->num_subpackets++] = subpacket;
      length -= (bitstream->pos - old_pos);
    }

    return packet;
  }

  int remaining_subpackets = parse_uint(bitstream, 11);

  for (uint8_t i = 0; i < remaining_subpackets; i++) {
    packet_t *subpacket = parse_packet(bitstream);
    packet->subpackets = realloc(
        packet->subpackets, (packet->num_subpackets + 1) * sizeof(packet_t *));
    packet->subpackets[packet->num_subpackets++] = subpacket;
  }

  return packet;
}

uint64_t calc_version_total(packet_t *packet) {
  uint64_t total = packet->version;
  for (uint8_t i = 0; i < packet->num_subpackets; i++) {
    total += calc_version_total(packet->subpackets[i]);
  }

  return total;
}

uint64_t eval(packet_t *packet) {
  switch (packet->type) {
  case 0: {
    uint64_t sum = 0;
    for (uint8_t i = 0; i < packet->num_subpackets; i++)
      sum += eval(packet->subpackets[i]);
    return sum;
  }
  case 1: {
    uint64_t prod = 1;
    for (uint8_t i = 0; i < packet->num_subpackets; i++)
      prod *= eval(packet->subpackets[i]);
    return prod;
  }
  case 2: {
    uint64_t min = INT64_MAX;
    for (uint8_t i = 0; i < packet->num_subpackets; i++)
      min = MIN(min, eval(packet->subpackets[i]));
    return min;
  }
  case 3: {
    uint64_t max = 0;
    for (uint8_t i = 0; i < packet->num_subpackets; i++)
      max = MAX(max, eval(packet->subpackets[i]));
    return max;
  }
  case 4:
    return packet->value;
  case 5:
    return eval(packet->subpackets[0]) > eval(packet->subpackets[1]);
  case 6:
    return eval(packet->subpackets[0]) < eval(packet->subpackets[1]);
  case 7:
    return eval(packet->subpackets[0]) == eval(packet->subpackets[1]);
  default:
    exit(1);
  }
}

void packet_destroy(packet_t *packet) {
  for (uint8_t i = 0; i < packet->num_subpackets; i++) {
    packet_destroy(packet->subpackets[i]);
  }

  free(packet);
}

void bistream_destroy(bitstream_t *bitstream) {
  free(bitstream->stream);
  free(bitstream);
}

uint64_t day16_part1(const char *input) {
  bitstream_t *bitstream = create_bitstream(input);
  packet_t *packet = parse_packet(bitstream);

  uint64_t total = calc_version_total(packet);

  packet_destroy(packet);
  bistream_destroy(bitstream);

  return total;
}

uint64_t day16_part2(const char *input) {
  bitstream_t *bitstream = create_bitstream(input);
  packet_t *packet = parse_packet(bitstream);

  uint64_t evaluated = eval(packet);

  packet_destroy(packet);
  bistream_destroy(bitstream);

  return evaluated;
}

AOC_MAIN(day16, 929, 911945136934);
