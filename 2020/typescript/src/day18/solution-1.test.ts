import { part1, part2 } from './solution-1';

const HOMEWORK = `
2 * 3 + (4 * 5)
5 + (8 * 3 + 9 + 3 * 4 * 3)
5 * 9 * (7 * 3 * 3 + 9 * 3 + (8 + 6 * 4))
((2 + 4 * 9) * (6 + 9 * 8 + 6) + 6) + 2 + 4 * 2
`.trim();

test('equal operator precedence', () => {
  expect(part1(HOMEWORK)).toBe(26335);
});

test('higher addition operator precedence', () => {
  expect(part2(HOMEWORK)).toBe(693891);
});
