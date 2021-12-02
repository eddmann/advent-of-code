.DEFAULT_GOAL := shell

IMAGE = gcc:11.2.0
DOCKER = docker run --rm -v $(PWD):/app:rw,delegated -w /app

shell:
	@$(DOCKER) -it $(IMAGE) bash

fmt:
	@$(DOCKER) --entrypoint= mikedld/clang-format sh -c "find . -iname *.h -o -iname *.c | xargs clang-format -i --style=LLVM"

solve/%:
	@$(DOCKER) -w /app/day$* $(IMAGE) sh -c "gcc -o solution solution.c ../shared/* && ./solution"
