from functools import cache
from collections import Counter


def parse_template_and_rules(input):
    template, rules = input.split('\n\n')
    return (template, dict(rule.split(' -> ') for rule in rules.splitlines()))


def polymerize(template, rules, steps):
    @cache
    def insert(left, right, step):
        if step == 0:
            return Counter()
        middle = rules[left + right]
        return Counter(middle) + insert(left, middle, step - 1) + insert(middle, right, step - 1)

    frequencies = Counter(template)
    for left, right in zip(template, template[1:]):
        frequencies += insert(left, right, steps)

    return max(frequencies.values()) - min(frequencies.values())


def part1(input):
    template, rules = parse_template_and_rules(input)
    return polymerize(template, rules, steps=10)


def part2(input):
    template, rules = parse_template_and_rules(input)
    return polymerize(template, rules, steps=40)
