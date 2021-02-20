import { part1, part2 } from './solution-1';

test('resulting floor from directions', () => {
  expect(part1('(())')).toBe(0);
  expect(part1('()()')).toBe(0);
  expect(part1('(((')).toBe(3);
  expect(part1('(()(()(')).toBe(3);
  expect(part1('))(((((')).toBe(3);
  expect(part1('())')).toBe(-1);
  expect(part1('))(')).toBe(-1);
  expect(part1(')))')).toBe(-3);
  expect(part1(')())())')).toBe(-3);
});

test('position which enters basement', () => {
  expect(part2(')')).toBe(1);
  expect(part2('()())')).toBe(5);
});
