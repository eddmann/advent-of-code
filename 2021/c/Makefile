.DEFAULT_GOAL := shell

IMAGE = gcc:11.2.0
DOCKER = docker run --rm -v $(PWD):/app:rw,delegated -w /app

shell:
	@$(DOCKER) -it $(IMAGE) bash

day/%:
	@$(DOCKER) -w /app/day$* $(IMAGE) sh -c "gcc -o solution solution.c ../shared/* && ./solution"
