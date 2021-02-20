import { toInt } from '../helpers';

type Wire = string;
type Instruction = string[];
type Signals = Map<Wire, number>;

const createInstructionExecutionOrder = (input: string): [Wire, Instruction][] => {
  const dependencies = new Map<Wire, Wire[]>();
  const instructions = new Map<Wire, Instruction>();

  for (const line of input.split('\n')) {
    const [instruction, wire] = line.split(' -> ');
    dependencies.set(wire, instruction.match(/([a-z]+)/g) || []);
    instructions.set(wire, instruction.split(' '));
  }

  const visited = new Set<Wire>();
  const ordered: Wire[] = [];

  [...dependencies.keys()].forEach(function dfs(wire: Wire) {
    if (visited.has(wire)) return;
    visited.add(wire);
    dependencies.get(wire).forEach(dfs);
    ordered.push(wire);
  });

  return ordered.reduce((wires, wire) => [...wires, [wire, instructions.get(wire)]], []);
};

const emulate = (signals: Signals, instruction: Instruction): number => {
  const get = (token: string): number => (signals.has(token) ? signals.get(token) : toInt(token));

  switch (true) {
    case instruction.includes('AND'):
      return get(instruction[0]) & get(instruction[2]);
    case instruction.includes('OR'):
      return get(instruction[0]) | get(instruction[2]);
    case instruction.includes('LSHIFT'):
      return get(instruction[0]) << get(instruction[2]);
    case instruction.includes('RSHIFT'):
      return get(instruction[0]) >> get(instruction[2]);
    case instruction.includes('NOT'):
      return ~get(instruction[1]) & 0xffff;
    default:
      return get(instruction[0]);
  }
};

export const part1 = (input: string): number => {
  const signals: Signals = createInstructionExecutionOrder(input).reduce(
    (signals, [wire, instruction]) => signals.set(wire, emulate(signals, instruction)),
    new Map(),
  );

  return signals.get('a');
};

export const part2 = (input: string): number => {
  const instructions = createInstructionExecutionOrder(
    input.replace(/^\d+ -> b$/gm, `${part1(input).toString()} -> b`),
  );
  const signals: Signals = instructions.reduce(
    (signals, [wire, instruction]) => signals.set(wire, emulate(signals, instruction)),
    new Map(),
  );

  return signals.get('a');
};
