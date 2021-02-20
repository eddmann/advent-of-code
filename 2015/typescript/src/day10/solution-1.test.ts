import { part1, part2 } from './solution-1';

test('40 iteration look and say', () => {
  expect(part1('1')).toBe(82350);
});

test('50 iteration look and say', () => {
  expect(part2('1')).toBe(1166642);
});
