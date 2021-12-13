from functools import reduce


def parse_paper_and_folds(input):
    [paper, folds] = input.split('\n\n')
    paper = set(tuple(map(int, dot.split(',')))
                for dot in paper.splitlines())
    folds = [(parts[0], int(parts[1]))
             for fold in folds.splitlines()
             if (parts := fold.replace('fold along ', '').split('='))]

    return (paper, folds)


def apply_fold(paper, fold):
    (coord, value) = fold
    return set(
        ((2 * value - x) if coord == 'x' and x > value else x,
         (2 * value - y) if coord == 'y' and y > value else y)
        for (x, y) in paper
    )


def part1(input):
    (paper, folds) = parse_paper_and_folds(input)

    return len(apply_fold(paper, folds[0]))


def part2(input):
    (paper, folds) = parse_paper_and_folds(input)

    paper = reduce(apply_fold, folds, paper)

    result = '\n'
    for y in range(max(y for (_, y) in paper) + 1):
        for x in range(max(x for (x, _) in paper) + 1):
            result += '#' if (x, y) in paper else ' '
        result += '\n'

    return result
