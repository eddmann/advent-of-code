export const part1 = (input: string): number => {
  const isNice = (line: string) => {
    const totalVowels = line.match(/[aeiou]/g)?.length || 0;
    const hasRepeatedLetter = /([a-z])\1/.test(line);
    const hasRestrictedSequence = /(ab|cd|pq|xy)/.test(line);

    return totalVowels >= 3 && hasRepeatedLetter && !hasRestrictedSequence;
  };

  return input.split('\n').filter(isNice).length;
};

export const part2 = (input: string): number => {
  const isNice = (line: string) => {
    const hasRepeatedPairWithoutOverlap = /([a-z]{2})[a-z]*\1/.test(line);
    const hasTripletWithRepeatedStartAndEnd = /([a-z])[a-z]\1/.test(line);

    return hasRepeatedPairWithoutOverlap && hasTripletWithRepeatedStartAndEnd;
  };

  return input.split('\n').filter(isNice).length;
};
