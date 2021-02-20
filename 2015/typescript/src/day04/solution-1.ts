import { createHash } from 'crypto';

const hash = (input: string): string => createHash('md5').update(input).digest('hex');

const calcLowestNonce = (input: string, totalLeadingZeros: number): number => {
  const prefix = '0'.repeat(totalLeadingZeros);

  let nonce = 1;
  while (!hash(input + nonce).startsWith(prefix)) nonce++;

  return nonce;
};

export const part1 = (input: string): number => calcLowestNonce(input, 5);

export const part2 = (input: string): number => calcLowestNonce(input, 6);
