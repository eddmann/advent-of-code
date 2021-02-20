import { toInt } from '../helpers';

const calcTriangleNumberAt = (row: number, col: number): number => {
  const side = row + col - 1;
  return (side * (side + 1)) / 2 - row;
};

const expMod = (base: number, exp: number, mod: number): number => {
  if (exp === 0) return 1;
  if (exp % 2 === 0) return Math.pow(expMod(base, exp / 2, mod), 2) % mod;
  return (base * expMod(base, exp - 1, mod)) % mod;
};

export const part1 = (input: string): number => {
  const [row, col] = input.match(/(\d+)/g).map(toInt);
  const firstCode = 20151125;

  const base = 252533;
  const exp = calcTriangleNumberAt(row, col);
  const mod = 33554393;

  return (expMod(base, exp, mod) * firstCode) % mod;
};
