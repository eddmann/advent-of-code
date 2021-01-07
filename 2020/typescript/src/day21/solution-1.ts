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

const buildAllergenIngredientsMap = (foods: Food[]) => {
  const allergenIngredients = new Map<string, Set<string>>();

  for (const food of foods) {
    for (const allergen of food.allergens) {
      allergenIngredients.set(
        allergen,
        allergenIngredients.has(allergen)
          ? intersection(allergenIngredients.get(allergen), food.ingredients)
          : food.ingredients,
      );
    }
  }

  return allergenIngredients;
};

export const part1 = (input: string): number => {
  const foods = parseFoods(input);

  const allergenIngredients = buildAllergenIngredientsMap(foods);
  const allIngredients = foods.map(({ ingredients }) => [...ingredients]).flat();
  const badIngredients = new Set([...allergenIngredients.values()].map(ingredients => [...ingredients]).flat());

  return allIngredients.filter(ingredient => !badIngredients.has(ingredient)).length;
};

export const part2 = (input: string): string => {
  const foods = parseFoods(input);

  const allergenIngredients = buildAllergenIngredientsMap(foods);
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
