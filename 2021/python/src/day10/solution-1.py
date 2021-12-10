chunks = {
    ')': '(',
    ']': '[',
    '}': '{',
    '>': '<'
}


def syntax_error_score(line: str) -> int:
    stack = []
    scores = {')': 3, ']': 57, '}': 1197, '>': 25137}

    for token in line:
        if token in chunks:
            open = stack.pop()
            if open != chunks[token]:
                return scores[token]
        else:
            stack.append(token)

    return 0


def autocomplete_score(line: str) -> int:
    stack = []
    scores = {'(': 1, '[': 2, '{': 3, '<': 4}

    for token in line:
        if token in chunks:
            stack.pop()
        else:
            stack.append(token)

    score = 0
    while stack:
        score = (score * 5) + scores[stack.pop()]
    return score


def part1(input: str) -> int:
    '''
    >>> part1(open("/app/src/day10/test-input.txt").read())
    26397
    '''

    return sum(map(syntax_error_score, input.splitlines()))


def part2(input: str) -> int:
    '''
    >>> part2(open("/app/src/day10/test-input.txt").read())
    288957
    '''

    incomplete_lines = [line for line in input.splitlines()
                        if syntax_error_score(line) == 0]
    scores = sorted(map(autocomplete_score, incomplete_lines))
    return scores[len(scores) // 2]
