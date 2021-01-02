import { part1, part2 } from './solution-1';

const ADAPTERS = `
28
33
18
42
31
14
46
20
48
47
24
23
49
45
19
38
39
11
1
32
25
35
8
17
7
9
4
2
34
10
3
`.trim();

test('jolt differences', () => {
  expect(part1(ADAPTERS)).toBe(220);
});

test('adapter arrangements', () => {
  expect(part2(ADAPTERS)).toBe(19208);
});
