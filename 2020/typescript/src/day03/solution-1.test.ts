import { part1, part2 } from './solution-1';

const MAP = `
..##.......
#...#...#..
.#....#..#.
..#.#...#.#
.#...##..#.
..#.##.....
.#.#.#....#
.#........#
#.##...#...
#...##....#
.#..#...#.#
`.trim();

test('trees encountered for 3 right, 1 down', () => {
  expect(part1(MAP)).toBe(7);
});

test('product of trees encountered', () => {
  expect(part2(MAP)).toBe(336);
});
