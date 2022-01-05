cmake_minimum_required(VERSION 3.12)

include(pico_sdk_import.cmake)

project(aoc2021)

set(c_flags -std=gnu11 -O2 -Wall)
add_compile_options("$<$<COMPILE_LANGUAGE:C>:${c_flags}>")
add_compile_definitions(AOC_PICO)

pico_sdk_init()

file(GLOB_RECURSE SOLUTIONS RELATIVE ${CMAKE_SOURCE_DIR} "../day*/solution.c" "../shared/dynarray.c")
add_executable(
  aoc2021
  aoc2021.cpp

  ${SOLUTIONS}

  display/pico_display.cpp
  display/pico_graphics.cpp
  display/st7789.cpp
  display/types.cpp
)

# Pull in pico libraries that we need
target_link_libraries(aoc2021 pico_stdlib hardware_spi hardware_pwm hardware_dma)

# create map/bin/hex file etc.
pico_add_extra_outputs(aoc2021)
