import { part1, part2 } from './solution-1';

test('total square feet of ribbon to order', () => {
  expect(part2('2x3x4')).toBe(34);
  expect(part2('1x1x10')).toBe(14);
});
