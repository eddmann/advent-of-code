from collections import defaultdict


def parse_template_and_rules(input):
    template, rules = input.split('\n\n')
    return (template, dict(rule.split(' -> ') for rule in rules.splitlines()))


def polymerize(template, rules, steps):
    frequencies, pairs = defaultdict(int), defaultdict(int)

    for char in template:
        frequencies[char] += 1

    for a, b in zip(template, template[1:]):
        pairs[a + b] += 1

    for _ in range(steps):
        next_pairs = defaultdict(int)

        for pair in pairs:
            char = rules[pair]
            frequencies[char] += pairs[pair]
            next_pairs[pair[0] + char] += pairs[pair]
            next_pairs[char + pair[1]] += pairs[pair]

        pairs = next_pairs

    return max(frequencies.values()) - min(frequencies.values())


def part1(input):
    template, rules = parse_template_and_rules(input)
    return polymerize(template, rules, steps=10)


def part2(input):
    template, rules = parse_template_and_rules(input)
    return polymerize(template, rules, steps=40)
