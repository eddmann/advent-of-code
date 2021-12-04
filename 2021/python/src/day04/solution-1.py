from math import sqrt


def parse_bingo_subsystem(input):
    sections = input.split("\n\n")
    numbers = [int(n) for n in sections[0].split(',')]
    boards = [[int(n) for n in board.replace('\n', ' ').split(' ') if n != '']
              for board in sections[1:]]
    return (numbers, boards)


def get_rows(board):
    size = int(sqrt(len(board)))
    return [board[row::size] for row in range(size)]


def get_cols(board):
    return list(map(list, zip(*get_rows(board))))


def is_winning_line(line):
    return all(n == None for n in line)


def is_winner(board):
    return any(is_winning_line(row) for row in get_rows(board)) or \
        any(is_winning_line(col) for col in get_cols(board))


def part1(input):
    '''
    >>> part1(open('/app/src/day04/test-input.txt').read())
    4512
    '''

    (numbers, boards) = parse_bingo_subsystem(input)

    for number in numbers:
        for board in boards:
            try:
                board[board.index(number)] = None
                if is_winner(board):
                    return number * sum(n for n in board if n != None)
            except:
                pass


def part2(input):
    '''
    >>> part2(open('/app/src/day04/test-input.txt').read())
    1924
    '''

    (numbers, boards) = parse_bingo_subsystem(input)

    for number in numbers:
        for board in boards:
            try:
                board[board.index(number)] = None
                if all(is_winner(b) for b in boards):
                    return number * sum(n for n in board if n != None)
            except:
                pass
