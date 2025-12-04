IMAGE = ghcr.io/eddmann/santa-lang-cli:latest
DOCKER = docker run --rm -v $(PWD):/aoc

.PHONY: test
test:
	@EXIT_CODE=0; \
	for s in *.santa; do \
		echo -e "\n--\n$$s\n--\n"; \
		$(DOCKER) $(IMAGE) --test /aoc/$$s; \
		if [ "$$?" != "0" ]; then \
			EXIT_CODE=1; \
		fi; \
	done; \
	exit $$EXIT_CODE
