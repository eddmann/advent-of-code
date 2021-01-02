type BusId = { id: number; offset: number };
type BusNotes = { depature: number; busIds: BusId[] };

const parseBusNotes = (input: string): BusNotes => {
  const [depature, busIds] = input.split('\n');
  return {
    depature: +depature,
    busIds: busIds.split(',').reduce((ids, id, offset) => (id === 'x' ? ids : [...ids, { id, offset }]), []),
  };
};

export const part1 = (input: string): number => {
  const { depature, busIds } = parseBusNotes(input);

  const [earliestBus] = busIds.map(({ id }) => ({ id, wait: id - (depature % id) })).sort((a, b) => a.wait - b.wait);

  return earliestBus.id * earliestBus.wait;
};

export const part2 = (input: string): number => {
  const { busIds } = parseBusNotes(input);

  const { timestamp } = busIds.reduce(
    ({ multiplier, timestamp }, { id, offset }) => {
      while ((timestamp + offset) % id !== 0) timestamp += multiplier;
      return { multiplier: multiplier * id, timestamp };
    },
    { multiplier: 1, timestamp: 0 },
  );

  return timestamp;
};
