const ALPHA = 'abcdefghijklmnopqrstuvwxyz';

const nextPossiblePassword = (password: string): string => {
  if (password === '') return '';

  const remaining = password.slice(0, -1);
  const next = ALPHA.indexOf(password.substr(-1)) + 1;

  return next < ALPHA.length ? remaining + ALPHA[next] : nextPossiblePassword(remaining) + ALPHA[0];
};

const isValidPassword = (password: string): boolean => {
  const hasRestrictedLetter = /[iol]/.test(password);
  const hasTwoNonOverlappingPairs = /([a-z])\1.*([a-z])\2/.test(password);
  const hasAlphaSequence = [...password.matchAll(/(?=([a-z]{3}))/g)].some(([, seq]) => ALPHA.includes(seq));

  return !hasRestrictedLetter && hasTwoNonOverlappingPairs && hasAlphaSequence;
};

const generateNextPassword = (seed: string): string => {
  let next = seed;
  while (true) {
    next = nextPossiblePassword(next);
    if (isValidPassword(next)) return next;
  }
};

export const part1 = (input: string): string => generateNextPassword(input);

export const part2 = (input: string): string => generateNextPassword(part1(input));
