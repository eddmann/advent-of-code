import { part1, part2 } from './solution-1';

test('the ideal lighting configuration', () => {
  expect(part1('turn on 0,0 through 999,999')).toBe(1000000);
  expect(part1('toggle 0,0 through 999,0')).toBe(1000);
  expect(part1('turn off 499,499 through 500,500')).toBe(0);
});

test('the ideal lighting configuration (with brightness)', () => {
  expect(part2('turn on 0,0 through 0,0')).toBe(1);
  expect(part2('toggle 0,0 through 999,999')).toBe(2000000);
});
