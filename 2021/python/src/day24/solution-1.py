from itertools import product


def parse_monad_sections(input):
    def parse_section(section):
        if section[4].endswith('1'):
            return (int(section[-3].split(' ')[-1]), None)
        return (None, int(section[5].split(' ')[-1]))

    return [parse_section(section.splitlines()) for section in input.split('inp')[1:]]


def compute_model(inputs, sections):
    z, inputs_idx = 0, 0
    model = [0] * len(sections)

    for section_idx, section in enumerate(sections):
        match (section):
            case (inc, None):
                model[section_idx] = inputs[inputs_idx]
                z = z * 26 + inputs[inputs_idx] + inc
                inputs_idx += 1
            case (None, mod):
                model[section_idx] = (z % 26) + mod
                z //= 26
                if not (1 <= model[section_idx] <= 9):
                    return None

    return int(''.join(map(str, model)))


def part1(input):
    sections = parse_monad_sections(input)
    for inputs in product(range(9, 0, -1), repeat=7):
        if (model := compute_model(inputs, sections)):
            return model


def part2(input):
    sections = parse_monad_sections(input)
    for inputs in product(range(1, 10), repeat=7):
        if (model := compute_model(inputs, sections)):
            return model
