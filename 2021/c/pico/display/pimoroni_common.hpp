#pragma once
#include "pico/stdlib.h"
#include <climits>
#include <stdint.h>

#define PIMORONI_I2C_DEFAULT_INSTANCE i2c0
#define PIMORONI_SPI_DEFAULT_INSTANCE spi0

namespace pimoroni {
static const unsigned int PIN_UNUSED =
    INT_MAX; // Intentionally INT_MAX to avoid overflowing MicroPython's int
             // type

// I2C
static const unsigned int I2C_DEFAULT_BAUDRATE = 400000;
static const unsigned int I2C_DEFAULT_SDA = 20;
static const unsigned int I2C_DEFAULT_SCL = 21;
static const unsigned int I2C_DEFAULT_INT = 22;

static const unsigned int I2C_BG_SDA = 4;
static const unsigned int I2C_BG_SCL = 5;
static const unsigned int I2C_BG_INT = 3;

// SPI
static const unsigned int SPI_DEFAULT_MOSI = 19;
static const unsigned int SPI_DEFAULT_MISO = 16;
static const unsigned int SPI_DEFAULT_SCK = 18;

static const unsigned int SPI_BG_FRONT_PWM = 20;
static const unsigned int SPI_BG_FRONT_CS = 17;

static const unsigned int SPI_BG_BACK_PWM = 21;
static const unsigned int SPI_BG_BACK_CS = 22;

enum BG_SPI_SLOT { BG_SPI_FRONT, BG_SPI_BACK, PICO_EXPLORER_ONBOARD };

enum BOARD { BREAKOUT_GARDEN, PICO_EXPLORER };

enum Polarity { ACTIVE_LOW = 0, ACTIVE_HIGH = 1 };

inline uint32_t millis() { return to_ms_since_boot(get_absolute_time()); }

constexpr uint8_t GAMMA[256] = {
    0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,
    0,   0,   0,   0,   0,   0,   0,   1,   1,   1,   1,   1,   1,   1,   2,
    2,   2,   2,   2,   2,   3,   3,   3,   3,   3,   4,   4,   4,   4,   5,
    5,   5,   5,   6,   6,   6,   7,   7,   7,   8,   8,   8,   9,   9,   9,
    10,  10,  11,  11,  11,  12,  12,  13,  13,  13,  14,  14,  15,  15,  16,
    16,  17,  17,  18,  18,  19,  19,  20,  21,  21,  22,  22,  23,  23,  24,
    25,  25,  26,  27,  27,  28,  29,  29,  30,  31,  31,  32,  33,  34,  34,
    35,  36,  37,  37,  38,  39,  40,  40,  41,  42,  43,  44,  45,  46,  46,
    47,  48,  49,  50,  51,  52,  53,  54,  55,  56,  57,  58,  59,  60,  61,
    62,  63,  64,  65,  66,  67,  68,  69,  70,  71,  72,  73,  74,  76,  77,
    78,  79,  80,  81,  83,  84,  85,  86,  88,  89,  90,  91,  93,  94,  95,
    96,  98,  99,  100, 102, 103, 104, 106, 107, 109, 110, 111, 113, 114, 116,
    117, 119, 120, 121, 123, 124, 126, 128, 129, 131, 132, 134, 135, 137, 138,
    140, 142, 143, 145, 146, 148, 150, 151, 153, 155, 157, 158, 160, 162, 163,
    165, 167, 169, 170, 172, 174, 176, 178, 179, 181, 183, 185, 187, 189, 191,
    193, 194, 196, 198, 200, 202, 204, 206, 208, 210, 212, 214, 216, 218, 220,
    222, 224, 227, 229, 231, 233, 235, 237, 239, 241, 244, 246, 248, 250, 252,
    255};
} // namespace pimoroni