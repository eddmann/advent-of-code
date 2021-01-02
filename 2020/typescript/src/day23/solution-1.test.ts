import { part1, part2 } from './solution-1';

const CUPS = '389125467';

test('labels on cups after one', () => {
  expect(part1(CUPS)).toBe(67384529);
});

test('two cups immediately clockwise of cup one', () => {
  expect(part2(CUPS)).toBe(149245887792);
});
