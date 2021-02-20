enum Direction {
  Up = '(',
  Down = ')',
}

const parseDirections = (input: string): Direction[] =>
  [...input].filter((d: string): d is Direction => Object.values(Direction).includes(d as Direction));

export const part1 = (input: string): number =>
  parseDirections(input).reduce((floor, direction) => floor + (direction === Direction.Up ? 1 : -1), 0);

export const part2 = (input: string): number => {
  let floor = 0;

  for (const [position, direction] of parseDirections(input).entries()) {
    floor += direction === Direction.Up ? 1 : -1;
    if (floor < 0) return position + 1;
  }

  throw new Error('Santa never enters the basement');
};
