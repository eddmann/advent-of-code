import { part1 } from './solution-2';

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
