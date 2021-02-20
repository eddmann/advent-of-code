type Replacement = [from: string, to: string];
type Molecule = string;

const parseReplacementsAndMolecule = (input: string): { replacements: Replacement[]; molecule: Molecule } => {
  const [replacements, molecule] = input.split('\n\n');

  return {
    replacements: replacements.split('\n').map(r => r.split(' => ', 2) as Replacement),
    molecule,
  };
};

const getMoleculeVariants = function* (m: Molecule, [from, to]: Replacement): Generator<Molecule> {
  const pattern = new RegExp(from, 'g');

  let occurence: RegExpExecArray | null;
  while ((occurence = pattern.exec(m))) {
    yield m.substr(0, occurence.index) + to + m.substr(occurence.index + from.length);
  }
};

export const part1 = (input: string): number => {
  const { replacements, molecule } = parseReplacementsAndMolecule(input);

  const variants: Molecule[] = replacements.reduce(
    (molecules, replacement) => [...molecules, ...getMoleculeVariants(molecule, replacement)],
    [],
  );

  return new Set<Molecule>(variants).size;
};

export const part2 = (input: string): number => {
  const { replacements, molecule } = parseReplacementsAndMolecule(input);
  const replacementsByLength = replacements.sort(([, x], [, y]) => y.length - x.length);

  let variant = molecule;
  let steps = 0;

  while (variant !== 'e') {
    for (const [from, to] of replacementsByLength) {
      for (const replacement of getMoleculeVariants(variant, [to, from])) {
        variant = replacement;
        steps += 1;
        break;
      }
    }
  }

  return steps;
};
