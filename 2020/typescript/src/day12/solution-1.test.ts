import { part1, part2 } from './solution-1';

const NAVIGATION_INSTRUCTIONS = `
F10
N3
F7
R90
F11
`.trim();

test('calculate locations manhattan distance', () => {
  expect(part1(NAVIGATION_INSTRUCTIONS)).toBe(25);
});

test('calculate locations manhattan distance using waypoint', () => {
  expect(part2(NAVIGATION_INSTRUCTIONS)).toBe(286);
});
