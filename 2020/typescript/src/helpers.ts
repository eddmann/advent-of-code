export const sum = (a: number, b: number) => a + b;

export const product = (a: number, b: number) => a * b;

export const mod = (n: number, m: number): number => ((n % m) + m) % m;

export const toInt = (decimal: string) => parseInt(decimal, 10);

export const transpose = <T>(a: T[][]) => a[0].map((_, c: number) => a.map((r: T[]) => r[c]));

export const cartesianProduct = (...a: any) => a.reduce((a, b) => a.flatMap(d => b.map(e => [d, e].flat())));

export const intersection = <T>(a: Set<T>, b: Set<T>): Set<T> => new Set([...a].filter(x => b.has(x)));

export const union = <T>(a: Set<T>, b: Set<T>): Set<T> => new Set([...a, ...b]);

export const repeat = <T>(times: number, fn: (x: T) => T, initial?: T): T => {
  while (times--) initial = fn(initial);
  return initial;
};

export class MapSet<T> {
  private set: Map<string, T>;

  constructor(initial: T[] = []) {
    this.set = new Map(initial.map(val => [this.toKey(val), val]));
  }

  has(val: T): boolean {
    return this.set.has(this.toKey(val));
  }

  add(val: T): this {
    this.set.set(this.toKey(val), val);
    return this;
  }

  delete(val: T): this {
    this.set.delete(this.toKey(val));
    return this;
  }

  [Symbol.iterator]() {
    return this.set.values();
  }

  get size() {
    return this.set.size;
  }

  private toKey(val: T): string {
    return JSON.stringify(val);
  }
}

export function* combinations<T>(arr: T[], size: number = arr.length): Generator<T[]> {
  const end = arr.length - 1;
  const combination = [];

  function* recur(start: number, index: number) {
    if (index === size) {
      return yield combination;
    }

    for (let i = start; i <= end && end - i + 1 >= size - index; i++) {
      combination[index] = arr[i];
      yield* recur(i + 1, index + 1);
    }
  }

  yield* recur(0, 0);
}
