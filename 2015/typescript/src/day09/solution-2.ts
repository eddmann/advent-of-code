import { permutations, toInt } from '../helpers';

type Location = string;
type Distance = number;
type Distances = { locations: Set<Location>; distances: Map<Location, Map<Location, Distance>> };

const parseLocationsAndDistances = (input: string): Distances =>
  input.split('\n').reduce(
    ({ distances, locations }, line) => {
      const [, from, to, distance] = line.match(/(.+) to (.+) = (\d+)/);

      distances.set(from, (distances.get(from) || new Map()).set(to, toInt(distance)));
      distances.set(to, (distances.get(to) || new Map()).set(from, toInt(distance)));
      locations.add(from);
      locations.add(to);

      return { distances, locations };
    },
    { locations: new Set(), distances: new Map() } as Distances,
  );

const calcTripDistances = ({ locations, distances }: Distances): number[] =>
  [...permutations([...locations])].map(([first, ...rest]) => {
    const [distance] = rest.reduce(
      ([distance, previous], location) => [distance + distances.get(previous).get(location), location],
      [0, first] as [Distance, Location],
    );
    return distance;
  });

export const part1 = (input: string): number => Math.min(...calcTripDistances(parseLocationsAndDistances(input)));

export const part2 = (input: string): number => Math.max(...calcTripDistances(parseLocationsAndDistances(input)));
