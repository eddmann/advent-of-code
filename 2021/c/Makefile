.DEFAULT_GOAL := shell

IMAGE = gcc:11.2.0
DOCKER = docker run --rm -v $(PWD):/app:rw,delegated -w /app

shell:
	@$(DOCKER) -it $(IMAGE) bash

fmt:
	@$(DOCKER) --entrypoint= mikedld/clang-format sh -c "find . -iname *.h -o -iname *.c | xargs clang-format -i --style=LLVM"

solve/%:
	@$(DOCKER) -w /app/day$* $(IMAGE) sh -c "gcc -D SINGLE_EXECUTABLE -o solution solution.c ../shared/* && ./solution"

test/%:
	@$(DOCKER) -w /app/day$* $(IMAGE) sh -c "gcc -D TEST_RUNNER -o solution solution.c ../shared/* && ./solution"

build:
	@$(DOCKER) -w /app $(IMAGE) sh -c "g++ -Wno-pointer-arith -fpermissive -o aoc2021 ./aoc2021.cpp shared/* && ./aoc2021"
