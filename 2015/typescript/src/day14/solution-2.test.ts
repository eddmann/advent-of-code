import { part1, part2 } from './solution-2';

const REINDEER = `
Comet can fly 14 km/s for 10 seconds, but then must rest for 127 seconds.
Dancer can fly 16 km/s for 11 seconds, but then must rest for 162 seconds.
`.trim();

test('distance winning reindeer has traveled', () => {
  expect(part1(REINDEER)).toBe(2660);
});

test('winning reindeers points', () => {
  expect(part2(REINDEER)).toBe(1558);
});
