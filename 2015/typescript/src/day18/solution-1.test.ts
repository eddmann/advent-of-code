import { part1, part2 } from './solution-1';

const LIGHT_GRID = `
.#.#.#
...##.
#....#
..#...
#.#..#
####..
`.trim();

test('lights on after 100 iterations', () => {
  expect(part1(LIGHT_GRID)).toBe(4);
});

test('lights on after 100 iterations (with stuck corners)', () => {
  expect(part2(LIGHT_GRID)).toBe(7);
});
