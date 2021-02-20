import { CompoundSet, repeat } from '../helpers';

type Light = [x: number, y: number];
type OnLights = CompoundSet<Light>;
type Neighbours = (l: Light) => Light[];

const parseGrid = (input: string): [upperBounds: number, lights: OnLights] => {
  const rows = input.split('\n');
  return [
    rows.length,
    rows.reduce((on, line, x) => {
      return [...line].reduce((on, light, y) => (light === '#' ? on.add([x, y]) : on), on);
    }, new CompoundSet<Light>()),
  ];
};

const neighboursFor = (upperBounds: number): Neighbours => ([x, y]: Light): Light[] => {
  const neighbours: Light[] = [];

  for (let dx = -1; dx <= 1; dx++) {
    for (let dy = -1; dy <= 1; dy++) {
      const [nx, ny] = [x + dx, y + dy];
      if (dx === 0 && dy === 0) continue;
      if (nx < 0 || ny < 0) continue;
      if (nx >= upperBounds || ny >= upperBounds) continue;
      neighbours.push([nx, ny]);
    }
  }

  return neighbours;
};

const animate = (neighboursFor: Neighbours) => (lights: OnLights): OnLights => {
  const onWithNeighours = new CompoundSet<Light>(
    [...lights].reduce((lights, light) => [...lights, light, ...neighboursFor(light)], []),
  );

  return new CompoundSet<Light>(
    [...onWithNeighours].filter(light => {
      const active = neighboursFor(light).filter(l => lights.has(l)).length;
      return active === 3 || (active === 2 && lights.has(light));
    }),
  );
};

const cornersStuckOn = (upperBounds: number) => (lights: OnLights): OnLights =>
  lights
    .add([0, 0])
    .add([0, upperBounds - 1])
    .add([upperBounds - 1, 0])
    .add([upperBounds - 1, upperBounds - 1]);

export const part1 = (input: string): number => {
  const [upperBounds, lights] = parseGrid(input);
  return repeat(100, animate(neighboursFor(upperBounds)), lights).size;
};

export const part2 = (input: string): number => {
  const [upperBounds, lights] = parseGrid(input);
  const stuck = cornersStuckOn(upperBounds);
  const action = animate(neighboursFor(upperBounds));
  return repeat(100, (l: OnLights) => stuck(action(l)), stuck(lights)).size;
};
