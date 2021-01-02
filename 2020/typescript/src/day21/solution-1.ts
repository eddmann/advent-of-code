import { intersection } from '../helpers';

type Food = { ingredients: Set<string>; allergens: Set<string> };

const parseFoods = (input: string): Food[] =>
  input.split('\n').map(food => {
    const [, ingredients, allergens] = food.match(/(.+) \(contains (.+)\)/);
    return {
      ingredients: new Set(ingredients.split(' ')),
      allergens: new Set(allergens.split(', ')),
    };
  });

const buildFoodMaps = (foods: Food[]) => {
  const allergenIngredients = new Map<string, Set<string>>();
  const ingredientOccurrences = new Map<string, number>();

  for (const food of foods) {
    for (const ingredient of food.ingredients) {
      ingredientOccurrences.set(ingredient, (ingredientOccurrences.get(ingredient) || 0) + 1);
    }

    for (const allergen of food.allergens) {
      allergenIngredients.set(
        allergen,
        allergenIngredients.has(allergen)
          ? intersection(allergenIngredients.get(allergen), food.ingredients)
          : food.ingredients,
      );
    }
  }

  return { allergenIngredients, ingredientOccurrences };
};

export const part1 = (input: string): number => {
  const foods = parseFoods(input);

  const { allergenIngredients, ingredientOccurrences } = buildFoodMaps(foods);
  const allIngredients = new Set([...allergenIngredients.values()].map(ingredients => [...ingredients]).flat());

  return [...ingredientOccurrences.entries()].reduce(
    (acc, [ingredient, count]) => acc + (allIngredients.has(ingredient) ? 0 : count),
    0,
  );
};

export const part2 = (input: string): string => {
  const foods = parseFoods(input);

  const { allergenIngredients } = buildFoodMaps(foods);
  const dangerous = [];

  while (allergenIngredients.size !== dangerous.length) {
    for (const [allergen, ingredients] of allergenIngredients) {
      if (ingredients.size !== 1) continue;
      const [ingredient] = [...ingredients];
      allergenIngredients.forEach(i => void i.delete(ingredient));
      dangerous.push([allergen, ingredient]);
    }
  }

  return dangerous
    .sort()
    .map(([, ingredient]) => ingredient)
    .join(',');
};
