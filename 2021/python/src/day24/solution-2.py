def parse_monad_sections(input):
    def parse_section(section):
        if section[4].endswith('1'):
            return (int(section[-3].split(' ')[-1]), None)
        return (None, int(section[5].split(' ')[-1]))

    return [parse_section(section.splitlines()) for section in input.split('inp')[1:]]


def solve(sections, initial_digit, acc):
    model = [0] * len(sections)
    stack = []

    for idx, (inc, mod) in enumerate(sections):
        if inc:
            stack.append((idx, inc))
            continue

        inc_idx, inc = stack.pop()
        diff = inc + mod
        model[inc_idx] = acc(initial_digit, initial_digit - diff)
        model[idx] = acc(initial_digit, initial_digit + diff)

    return int("".join(map(str, model)))


def part1(input):
    print(parse_monad_sections(input))
    return solve(parse_monad_sections(input), 9, min)


def part2(input):
    return solve(parse_monad_sections(input), 1, max)
