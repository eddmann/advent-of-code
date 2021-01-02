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

const mod = (n: bigint, m: bigint): bigint => ((n % m) + m) % m;
const modInv = (n: bigint, m: bigint): bigint => {
  const N = BigInt(n % m);

  for (let i = 1n; i <= m; i++) {
    if ((N * i) % m == 1n) {
      return i;
    }
  }

  return 1n;
};

export const part2 = (input: string): number => {
  const { busIds } = parseBusNotes(input);

  const buses = busIds.map(({ id, offset }) => ({
    divisor: BigInt(id),
    remainder: BigInt(mod(BigInt(id - offset), BigInt(id))),
  }));

  const productOfDivisors = buses.reduce((product, { divisor }) => product * divisor, 1n);

  const crtSum = buses.reduce((acc, { remainder, divisor }) => {
    const n = productOfDivisors / divisor;
    return acc + n * modInv(n, divisor) * remainder;
  }, 0n);

  return Number(mod(crtSum, productOfDivisors));
};
