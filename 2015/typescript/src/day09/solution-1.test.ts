import { part1, part2 } from './solution-1';

const DISTANCES = `
London to Dublin = 464
London to Belfast = 518
Dublin to Belfast = 141
`.trim();

test('determine shortest route', () => {
  expect(part1(DISTANCES)).toBe(605);
});

test('determine longest route', () => {
  expect(part2(DISTANCES)).toBe(982);
});
