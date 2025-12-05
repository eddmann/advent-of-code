IMAGE = ghcr.io/eddmann/santa-lang-cli:latest
DOCKER = docker run --rm -v $(PWD):/aoc

.PHONY: test
test:
	@docker pull -q $(IMAGE)
	@EXIT_CODE=0; \
	for s in *.santa; do \
		printf '\n┌──────────────────────────────────────┐\n│  %-35s │\n└──────────────────────────────────────┘\n\n' "$$s"; \
		$(DOCKER) $(IMAGE) --test /aoc/$$s; \
		if [ "$$?" != "0" ]; then \
			EXIT_CODE=1; \
		fi; \
	done; \
	exit $$EXIT_CODE
