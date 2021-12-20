def parse_algorithm_and_image(input):
    algorithm, _, *image = input.splitlines()

    algorithm = [pixel == '#' for pixel in algorithm]
    image = {(x, y): pixel == '#'
             for y, row in enumerate(image)
             for x, pixel in enumerate(row)}

    return (algorithm, image)


def index(image, x, y, default):
    directions = [(-1, -1), (0, -1), (1, -1), (-1, 0),
                  (0, 0), (1, 0), (-1, 1), (0, 1), (1, 1)]

    binary = ['1' if image.get((x + dx, y + dy), default) else '0'
              for dx, dy in directions]

    return int(''.join(binary), 2)


def enhance(algorithm, image, default):
    min_x = min(x for x, _ in image)
    max_x = max(x for x, _ in image)
    min_y = min(y for _, y in image)
    max_y = max(y for _, y in image)

    new_image = {}

    for y in range(min_y - 1, max_y + 2):
        for x in range(min_x - 1, max_x + 2):
            new_image[(x, y)] = algorithm[index(image, x, y, default)]

    return new_image


def part1(input):
    '''
    >>> part1(open("/app/src/day20/test-input.txt").read())
    35
    '''

    (algorithm, image) = parse_algorithm_and_image(input)

    for step in range(2):
        image = enhance(algorithm, image, step % 2 and algorithm[0])

    return sum(image.values())


def part2(input):
    '''
    >>> part2(open("/app/src/day20/test-input.txt").read())
    3351
    '''

    (algorithm, image) = parse_algorithm_and_image(input)

    for step in range(50):
        image = enhance(algorithm, image, step % 2 and algorithm[0])

    return sum(image.values())
