import { toInt, transpose, zip, product, max } from '../helpers';

type Quantity = number;
type Mixture = Quantity[];
type Property = number;
type Ingredient = Property[];

const parseIngredients = (input: string): Ingredient[] =>
  input.split('\n').map(line => line.match(/(-?\d+)/g).map(toInt));

const mixtures = (teaspoons: Quantity, ingredients: number): Mixture[] => {
  if (ingredients < 2) return [[teaspoons]];

  return [...Array(teaspoons + 1).keys()].reduce(
    (mixes, quantity) =>
      mixes.concat(mixtures(teaspoons - quantity, ingredients - 1).map(mixture => [quantity, ...mixture])),
    [],
  );
};

const calcCookieScore = (ingredients: Ingredient[], mixture: Mixture): { score: number; calories: number } => {
  const properties = transpose(ingredients).map(property =>
    Math.max(
      zip(property, mixture).reduce((sum, [p, m]) => sum + p * m, 0),
      0,
    ),
  );
  const calories = properties.pop();

  return { score: properties.reduce(product), calories };
};

const RECIPE_TEASPOONS = 100;

export const part1 = (input: string): number => {
  const ingredients = parseIngredients(input);

  const scores = mixtures(RECIPE_TEASPOONS, ingredients.length).map(
    mixture => calcCookieScore(ingredients, mixture).score,
  );

  return max(scores);
};

export const part2 = (input: string): number => {
  const ingredients = parseIngredients(input);

  const scores = mixtures(RECIPE_TEASPOONS, ingredients.length).map(mixture => {
    const { score, calories } = calcCookieScore(ingredients, mixture);
    return calories === 500 ? score : 0;
  });

  return max(scores);
};
