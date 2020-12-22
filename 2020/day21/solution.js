const intersect = (...sets) => {
  if (!sets.length) return new Set();
  const i = sets.reduce((m, s, i) => (s.size < sets[m].size ? i : m), 0);
  const [smallest] = sets.splice(i, 1);
  const res = new Set();
  for (let val of smallest) if (sets.every((s) => s.has(val))) res.add(val);
  return res;
};

const part1 = (foods) => {
  const allergens = new Map();
  const ingredientCount = new Map();

  foods.forEach((food) => {
    food.allergens.forEach((allergen) => {
      allergens.set(
        allergen,
        allergens.has(allergen)
          ? intersect(allergens.get(allergen), food.ingredients)
          : food.ingredients
      );
    });
    food.ingredients.forEach((ingredient) => {
      ingredientCount.set(
        ingredient,
        (ingredientCount.get(ingredient) || 0) + 1
      );
    });
  });

  const allIngredients = new Set(
    [...allergens.values()].map((ingredients) => [...ingredients]).flat()
  );

  return [...ingredientCount.entries()].reduce(
    (acc, [ingredient, count]) =>
      acc + (allIngredients.has(ingredient) ? 0 : count),
    0
  );
};

const part2 = (foods) => {
  const allergens = new Map();

  foods.forEach((food) => {
    food.allergens.forEach((allergen) => {
      allergens.set(
        allergen,
        allergens.has(allergen)
          ? intersect(allergens.get(allergen), food.ingredients)
          : food.ingredients
      );
    });
  });

  const dangerous = [];

  while (allergens.size !== dangerous.length) {
    allergens.forEach((ingredients, allergen) => {
      if (ingredients.size !== 1) return;
      const ingredient = [...ingredients][0];
      ingredients.clear();
      allergens.forEach((oi) => void oi.delete(ingredient));
      dangerous.push([allergen, ingredient]);
    });
  }

  dangerous.sort();
  return dangerous.map(([, ingredient]) => ingredient).join(",");
};

const foods = require("fs")
  .readFileSync(process.argv[2], "utf-8")
  .split("\n")
  .map((line) => {
    const [, ingredients, allergens] = line.match(/(.+) \(contains (.+)\)/);
    return {
      ingredients: new Set(ingredients.split(" ")),
      allergens: new Set(allergens.split(", ")),
    };
  });

console.log(part1(foods));
console.log(part2(foods));
