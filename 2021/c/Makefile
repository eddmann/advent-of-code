.DEFAULT_GOAL := build

IMAGE = gcc:11.2.0
DOCKER = docker run --rm -v $(PWD):/app:rw,delegated -w /app
CFLAGS = -lm -std=gnu11 -march=native -Ofast -Wall -Werror
SOURCE = $(wildcard shared/* day*/input.h day*/solution.c)

.PHONY: shell
shell:
	@$(DOCKER) -it $(IMAGE) bash

.PHONY: fmt
fmt:
	@$(DOCKER) --entrypoint= mikedld/clang-format \
	  sh -c "find . -type f -iname '*.h' -o -iname '*.c' | xargs clang-format -i --style=LLVM"

solve/%:
	@$(DOCKER) -w /app/day$* $(IMAGE) \
	  sh -c 'gcc -D AOC_SINGLE_EXECUTABLE ${CFLAGS} -o solution solution.c ../shared/* && ./solution'

.PHONY: test
test:
	@$(DOCKER) -e DAY -w /app $(IMAGE) \
	  sh -c ' \
	    for s in /app/day$${DAY:-*}/solution.c; \
	      do cd $$(dirname $$s); \
	      gcc -D AOC_TEST_RUNNER ${CFLAGS} -o solution solution.c ../shared/*; \
		  ./solution || exit 1; \
	    done'

.PHONY: build
build:
	@$(DOCKER) -e DAY -w /app $(IMAGE) \
	  sh -c 'gcc ${CFLAGS} -o aoc2021 $(SOURCE) aoc2021.c && ./aoc2021'

.PHONY: pico/setup
pico/setup:
	rm -fr pico/pico-sdk
	git clone git@github.com:raspberrypi/pico-sdk.git pico/pico-sdk
	git -C pico/pico-sdk submodule update --init

.PHONY: pico/build
pico/build:
	@docker run --rm \
	  -v $(PWD):/app \
	  -w /app \
	  -e PICO_SDK_PATH="/app/pico/pico-sdk" \
	  xingrz/rpi-pico-builder:latest \
	  bash -c 'mkdir -p pico/build && cd pico/build && cmake .. && make'

.PHONY: pico/shell
pico/shell:
	@docker run --rm -it \
	  -v $(PWD):/app \
	  -w /app \
	  -e PICO_SDK_PATH="/app/pico/pico-sdk" \
	  xingrz/rpi-pico-builder:latest \
	  bash

.PHONY: valgrind/build
valgrind/build:
	docker build -t eddmann/aoc2021-valgrid - < Dockerfile.valgrind

valgrind/memcheck/%:
	@$(DOCKER) -it -w /app/day$* eddmann/aoc2021-valgrid \
	  sh -c 'gcc -D AOC_SINGLE_EXECUTABLE ${CFLAGS} -g -o solution solution.c ../shared/* && valgrind ./solution'

valgrind/massif/%:
	@$(DOCKER) -it -w /app/day$* eddmann/aoc2021-valgrid \
	  sh -c 'gcc -D AOC_SINGLE_EXECUTABLE ${CFLAGS} -g -o solution solution.c ../shared/* && valgrind --tool=massif ./solution && ms_print massif.out.*'
