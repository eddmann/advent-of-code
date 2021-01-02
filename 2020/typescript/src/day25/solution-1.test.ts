import { part1 } from './solution-1';

const PUBLIC_KEYS = `
5764801
17807724
`.trim();

test('handshake encryption key', () => {
  expect(part1(PUBLIC_KEYS)).toBe(14897079);
});
