IMAGE := local/clojure:lein-exec
DOCKER := docker run --rm -v $(PWD):/src -w /src
RUN := $(DOCKER) $(IMAGE)

.PHONY: build-image
build-image:
	docker build . -t $(IMAGE)

.PHONY: exec/%
exec/%:
	$(DOCKER) -it $(IMAGE) exec $*

.PHONY: shell
shell:
	$(DOCKER) --entrypoint= -it $(IMAGE) bash
