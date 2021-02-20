import { part1, part2 } from './solution-1';

test('total square feet of wrapping paper to order', () => {
  expect(part1('2x3x4')).toBe(58);
  expect(part1('1x1x10')).toBe(43);
});

test('total square feet of ribbon to order', () => {
  expect(part2('2x3x4')).toBe(34);
  expect(part2('1x1x10')).toBe(14);
});
