import { part1, part2 } from './solution-1';

test('houses that recieve presents from santa', () => {
  expect(part1('>')).toBe(2);
  expect(part1('^>v<')).toBe(4);
  expect(part1('^v^v^v^v^v')).toBe(2);
});

test('houses that recieve presents from santa and robo-santa', () => {
  expect(part2('^v')).toBe(3);
  expect(part2('^>v<')).toBe(3);
  expect(part2('^v^v^v^v^v')).toBe(11);
});
