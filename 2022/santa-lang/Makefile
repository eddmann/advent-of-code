IMAGE = ghcr.io/eddmann/santa-lang-ts:cli-latest
DOCKER = docker run --rm -v $(PWD):/aoc -w /aoc

.PHONY: test
test:
	@$(DOCKER) --entrypoint= $(IMAGE) \
	  sh -c '\
	    EXIT_CODE=0; \
	    for s in /aoc/*.santa; do \
		  echo -e "\n--\n$$s\n--\n"; \
		  santa-cli -t $$s; \
		  if [ "$$?" != "0" ]; then \
		  	EXIT_CODE=1; \
		  fi; \
		done; \
		exit $$EXIT_CODE'

.PHONY: shell
shell:
	@$(DOCKER) -it -e SANTA_CLI_SESSION_TOKEN --entrypoint= $(IMAGE) sh
