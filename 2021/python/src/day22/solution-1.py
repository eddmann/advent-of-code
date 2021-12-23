from re import findall


def parse_reboot_steps(input):
    return [(step[1] == 'n', tuple(map(int, findall('[-0-9]+', step))))
            for step in input.splitlines()]


def intersect(a, b):
    x1, X1, y1, Y1, z1, Z1 = a
    x2, X2, y2, Y2, z2, Z2 = b

    x = max(x1, x2)
    X = min(X1, X2)
    y = max(y1, y2)
    Y = min(Y1, Y2)
    z = max(z1, z2)
    Z = min(Z1, Z2)

    if x <= X and y <= Y and z <= Z:
        return (x, X, y, Y, z, Z)

    return None


def part1(input):
    steps = parse_reboot_steps(input)
    cubes = set()

    for step in steps:
        on, (xs, Xs, ys, Ys, zs, Zs) = step

        for x in range(max(-50, xs), min(50, Xs + 1)):
            for y in range(max(-50, ys), min(50, Ys) + 1):
                for z in range(max(-50, zs), min(50, Zs) + 1):
                    if on:
                        cubes.add((x, y, z))
                    else:
                        cubes.discard((x, y, z))

    return len(cubes)


def part2(input):
    steps = parse_reboot_steps(input)
    cubes = []

    for step in steps:
        (step_on, step_state) = step

        cube_corrections = []
        for cube in cubes:
            (cube_on, cube_state) = cube
            if intersection := intersect(step_state, cube_state):
                cube_corrections.append((not cube_on, intersection))

        cubes.extend(cube_corrections)

        if step_on:
            cubes.append(step)

    volume = 0
    for cube in cubes:
        on, (x, X, y, Y, z, Z) = cube
        volume += (1 if on else -1) * (X-x+1) * (Y-y+1) * (Z-z+1)

    return volume
