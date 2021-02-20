import { part1, part2 } from './solution-2';

const CONTAINERS = `
43
3
4
10
21
44
4
6
47
41
34
17
17
44
36
31
46
9
27
38
`.trim();

test('total combinations of containers that fit all the eggnog', () => {
  expect(part1(CONTAINERS)).toBe(1638);
});

test('total occurrences of minimum number of containers that fit all the eggnog', () => {
  expect(part2(CONTAINERS)).toBe(17);
});
