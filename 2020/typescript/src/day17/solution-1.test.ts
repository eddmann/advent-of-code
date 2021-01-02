import { part1, part2 } from './solution-1';

const POCKET_DIMESION = `
.#.
..#
###
`.trim();

test('3d six-cycle boot process', () => {
  expect(part1(POCKET_DIMESION)).toBe(112);
});

test('4d six-cycle boot process', () => {
  expect(part2(POCKET_DIMESION)).toBe(848);
});
