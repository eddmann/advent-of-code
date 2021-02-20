import { part1 } from './solution-2';

test("get emulated signal for 'a'", () => {
  const CIRCUIT = `
123 -> x
456 -> y
x AND y -> d
x OR y -> e
x LSHIFT 2 -> f
y RSHIFT 2 -> g
NOT x -> h
NOT y -> a
`.trim();

  expect(part1(CIRCUIT)).toBe(65079);
});
