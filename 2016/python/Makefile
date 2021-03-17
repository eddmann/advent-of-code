.DEFAULT_GOAL := help

IMAGE = python:3.9.2-alpine3.13
DOCKER = docker run --rm -v $(PWD):/app:rw,delegated -w /app

.PHONY: solve
solve: ## Solve specific day (with optional solution) `make solve day=1 sol=1`
	@$(DOCKER) -it $(IMAGE) python src/solve.py $(day) $(sol)

.PHONY: test
test: ## Run each solutions doctests
	@$(DOCKER) -it $(IMAGE) python src/test.py

.PHONY: shell
shell: ## Shell instance for development
	@$(DOCKER) -it $(IMAGE) sh

# https://blog.thapaliya.com/posts/well-documented-makefiles/
.PHONY: help
help:
	@awk 'BEGIN {FS = ":.*##"; printf "\nUsage:\n  make \033[36m<target>\033[0m\n"} /^[a-zA-Z_-]+:.*?##/ { printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2 } /^##@/ { printf "\n\033[1m%s\033[0m\n", substr($$0, 5) } ' $(MAKEFILE_LIST)
