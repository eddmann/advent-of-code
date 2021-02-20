import { part1, part2 } from './solution-1';

test('is nice string', () => {
  expect(part1('ugknbfddgicrmopn')).toBe(1);
  expect(part1('aaa')).toBe(1);
  expect(part1('jchzalrnumimnmhp')).toBe(0);
  expect(part1('haegwjzuvuyypxyu')).toBe(0);
  expect(part1('dvszwmarrgswjxmb')).toBe(0);
});

test('is nice string (with improved model)', () => {
  expect(part2('qjhvhtzxzqqjkmpb')).toBe(1);
  expect(part2('xxyxx')).toBe(1);
  expect(part2('uurcxstgmygtbstg')).toBe(0);
  expect(part2('ieodomkazucvgmuy')).toBe(0);
});
