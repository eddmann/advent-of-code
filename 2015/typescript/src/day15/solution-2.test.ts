import { part1, part2 } from './solution-2';

const INGREDIENTS = `
Butterscotch: capacity -1, durability -2, flavor 6, texture 3, calories 8
Cinnamon: capacity 2, durability 3, flavor -2, texture -1, calories 3
`.trim();

test('total score of the highest-scoring cookie', () => {
  expect(part1(INGREDIENTS)).toBe(62842880);
});

test('total score of the highest-scoring cookie with 500 calories', () => {
  expect(part2(INGREDIENTS)).toBe(57600000);
});
