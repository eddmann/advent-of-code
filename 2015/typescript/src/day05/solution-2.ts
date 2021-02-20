export const part1 = (input: string): number =>
  input.match(/^(?=(?:.*[aeiou].*){3,})(?=.*(.)\1.*)(?!.*(?:ab|cd|pq|zy).*).*/gm).length;

export const part2 = (input: string): number => input.match(/^(?=.*(..).*\1)(?=.*(.).\2.*).*/gm).length;
