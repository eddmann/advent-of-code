.DEFAULT_GOAL := help

IMAGE = clojure:alpine
DOCKER = docker run --rm -v $(PWD):/app:rw,delegated -w /app

.PHONY: solve
solve: ## Solve specific day and part `make solve day=1 part=1`
	@$(DOCKER) -it $(IMAGE) lein run d$(day).p$(part)

.PHONY: test
test: # Run test suite
  ifdef CI
	$(DOCKER) -e CI=1 $(IMAGE) lein test
  else
	@$(DOCKER) -it $(IMAGE) lein test
  endif

.PHONY: shell
shell: ## Shell instance for development
	@$(DOCKER) -it $(IMAGE) sh

# https://blog.thapaliya.com/posts/well-documented-makefiles/
.PHONY: help
help:
	@awk 'BEGIN {FS = ":.*##"; printf "\nUsage:\n  make \033[36m<target>\033[0m\n"} /^[a-zA-Z_-]+:.*?##/ { printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2 } /^##@/ { printf "\n\033[1m%s\033[0m\n", substr($$0, 5) } ' $(MAKEFILE_LIST)
