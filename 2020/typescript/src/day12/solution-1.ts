enum CardinalDirection {
  North = 'N',
  East = 'E',
  South = 'S',
  West = 'W',
}
enum Movement {
  Left = 'L',
  Right = 'R',
  Forward = 'F',
}
type Action = CardinalDirection | Movement;
type Instruction = { action: Action; value: number };

const isAction = (x: string): x is Action => ['N', 'E', 'S', 'W', 'L', 'R', 'F'].includes(x);
const parseNavigationInstructions = (input: string): Instruction[] =>
  input.split('\n').map(instruction => {
    const [action, value] = [instruction[0], instruction.slice(1)];
    if (isAction(action)) return { action, value: +value };
    throw new Error(`Invalid action ${action}`);
  });

const manhattanDistance = (x: number, y: number): number => Math.abs(x) + Math.abs(y);

const mod = (n: number, m: number): number => ((n % m) + m) % m;

const toCardinal = (angle: number): CardinalDirection =>
  ({
    0: CardinalDirection.East,
    90: CardinalDirection.South,
    180: CardinalDirection.West,
    270: CardinalDirection.North,
  }[angle]);

const rotateWaypoint = (x: number, y: number, direction: number): [x: number, y: number] =>
  direction % 360 === 0 ? [x, y] : rotateWaypoint(-y, x, direction - 90);

export const part1 = (input: string): number => {
  const instrutions = parseNavigationInstructions(input);

  const { x, y } = instrutions.reduce(
    ({ x, y, direction }, { action, value }) => {
      switch (action === Movement.Forward ? toCardinal(direction) : action) {
        case CardinalDirection.North:
          return { x, y: y + value, direction };
        case CardinalDirection.East:
          return { x: x + value, y, direction };
        case CardinalDirection.South:
          return { x, y: y - value, direction };
        case CardinalDirection.West:
          return { x: x - value, y, direction };
        case Movement.Left:
          return { x, y, direction: mod(direction - value, 360) };
        case Movement.Right:
          return { x, y, direction: mod(direction + value, 360) };
      }
    },
    { x: 0, y: 0, direction: 0 },
  );

  return manhattanDistance(x, y);
};

export const part2 = (input: string): number => {
  const instrutions = parseNavigationInstructions(input);

  const { x, y } = instrutions.reduce(
    ({ x, y, wx, wy }, { action, value }) => {
      switch (action) {
        case CardinalDirection.North:
          return { x, y, wx, wy: wy + value };
        case CardinalDirection.East:
          return { x, y, wx: wx + value, wy };
        case CardinalDirection.South:
          return { x, y, wx, wy: wy - value };
        case CardinalDirection.West:
          return { x, y, wx: wx - value, wy };
        case Movement.Forward:
          return { x: x + wx * value, y: y + wy * value, wx, wy };
        case Movement.Left:
        case Movement.Right:
          const [newWx, newWy] = rotateWaypoint(wx, wy, action === Movement.Right ? -value : value);
          return { x, y, wx: newWx, wy: newWy };
      }
    },
    { x: 0, y: 0, wx: 10, wy: 1 },
  );

  return manhattanDistance(x, y);
};
