import { part1, part2 } from './solution-1';

const FOODS = `
mxmxvkd kfcds sqjhc nhms (contains dairy, fish)
trh fvjkl sbzzf mxmxvkd (contains dairy)
sqjhc fvjkl (contains soy)
sqjhc mxmxvkd sbzzf (contains fish)
`.trim();

test('occurrences of ingredients without allergens', () => {
  expect(part1(FOODS)).toBe(5);
});

test('canonical dangerous ingredient list', () => {
  expect(part2(FOODS)).toBe('mxmxvkd,sqjhc,fvjkl');
});
