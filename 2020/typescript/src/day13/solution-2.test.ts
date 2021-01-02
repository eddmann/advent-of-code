import { part1, part2 } from './solution-2';

const BUS_NOTES = `
939
7,13,x,x,59,x,31,19
`.trim();

test('earliest bus', () => {
  expect(part1(BUS_NOTES)).toBe(295);
});

test('earliest bus with offsets', () => {
  expect(part2(BUS_NOTES)).toBe(1068781);
});
