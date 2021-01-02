import { toInt } from '../helpers';

const parsePublicKeys = (input: string) => input.split('\n').map(toInt) as [number, number];

const expMod = (base: number, exp: number, mod: number): number => {
  if (exp === 0) return 1;
  if (exp % 2 === 0) return Math.pow(expMod(base, exp / 2, mod), 2) % mod;
  return (base * expMod(base, exp - 1, mod)) % mod;
};

const MAX_KEY_SIZE = 20201227;

const calcExp = (publicKey, subjectNumber = 7) => {
  let currentKey = 0;
  let loopSize = 0;

  while (currentKey !== publicKey) {
    loopSize++;
    currentKey = expMod(subjectNumber, loopSize, MAX_KEY_SIZE);
  }

  return loopSize;
};

export const part1 = (input: string): number => {
  const [cardPublicKey, doorPublicKey] = parsePublicKeys(input);

  return expMod(cardPublicKey, calcExp(doorPublicKey), MAX_KEY_SIZE);
};

export const part2 = (input: string): number => 0;
