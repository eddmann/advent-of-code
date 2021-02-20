export const part1 = (input: string): number => input.split('(').length - input.split(')').length;
