import { part1, part2 } from './solution-1';

const XMAS_DATA = `
5

35
20
15
25
47
40
62
55
65
95
102
117
150
182
127
219
299
277
309
576
`.trim();

test('find weakness', () => {
  expect(part1(XMAS_DATA)).toBe(127);
});

test('contiguous sum', () => {
  expect(part2(XMAS_DATA)).toBe(62);
});
