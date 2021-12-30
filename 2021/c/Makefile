.DEFAULT_GOAL := shell

IMAGE = gcc:11.2.0
DOCKER = docker run --rm -v $(PWD):/app:rw,delegated -w /app
CFLAGS = -std=gnu11 -march=native -O2

shell:
	@$(DOCKER) -it $(IMAGE) bash

fmt:
	@$(DOCKER) --entrypoint= mikedld/clang-format \
	  sh -c 'find . -iname *.h -o -iname *.c | xargs clang-format -i --style=LLVM'

solve/%:
	@$(DOCKER) -w /app/day$* $(IMAGE) \
	  sh -c 'gcc -D SINGLE_EXECUTABLE ${CFLAGS} -o solution solution.c ../shared/* && ./solution'

test:
	@$(DOCKER) -e DAY -w /app $(IMAGE) \
	  sh -c ' \
	    for s in /app/day$${DAY:-*}/solution.c; \
	      do cd $$(dirname $$s); \
	      gcc -D TEST_RUNNER ${CFLAGS} -o solution solution.c ../shared/*; \
		  ./solution || exit 1; \
	    done'

build:
	@$(DOCKER) -w /app $(IMAGE) \
	  sh -c 'g++ -Wno-pointer-arith -fpermissive -O2 -o aoc2021 ./aoc2021.cpp shared/* && ./aoc2021'
