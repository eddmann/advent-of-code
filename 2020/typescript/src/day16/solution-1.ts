import { transpose, toInt } from '../helpers';

const parseTicketNotes = (input: string) => {
  const [rules, [, yourTicket], [, ...nearbyTickets]] = input.split('\n\n').map(line => line.split('\n'));

  return {
    rules: rules.map(rule => {
      const [, name, aMin, aMax, bMin, bMax] = rule.match(/([a-z\s]+)\: (\d+)-(\d+) or (\d+)-(\d+)/);
      return { name, isMatch: (v: number) => (v >= +aMin && v <= +aMax) || (v >= +bMin && v <= +bMax) };
    }),
    yourTicket: yourTicket.split(',').map(toInt),
    nearbyTickets: nearbyTickets.map(ticket => ticket.split(',').map(toInt)),
  };
};

export const part1 = (input: string): number => {
  const { rules, nearbyTickets } = parseTicketNotes(input);

  const invalidFieldValues = nearbyTickets.flatMap(ticket =>
    ticket.filter(number => !rules.some(({ isMatch }) => isMatch(number))),
  );

  return invalidFieldValues.reduce((acc, val) => acc + val, 0);
};

export const part2 = (input: string): number => {
  const { rules, yourTicket, nearbyTickets } = parseTicketNotes(input);

  const validNearbyTickets = nearbyTickets.filter(ticket =>
    ticket.every(number => rules.some(({ isMatch }) => isMatch(number))),
  );

  const possibleColumnNames: [idx: number, names: Set<string>][] = transpose(validNearbyTickets).map((column, idx) => {
    return [
      idx,
      rules.reduce((names, { name, isMatch }) => {
        return column.every(number => isMatch(number)) ? names.add(name) : names;
      }, new Set<string>()),
    ];
  });

  const columnNames = new Map<string, number>();

  while (possibleColumnNames.length !== columnNames.size) {
    for (const [idx, names] of possibleColumnNames) {
      if (names.size !== 1) continue;
      const [name] = names;
      possibleColumnNames.forEach(([, ns]) => void ns.delete(name));
      columnNames.set(name, idx);
    }
  }

  const departureColumns = [...columnNames.entries()].reduce(
    (idxs, [name, idx]) => (name.startsWith('departure') ? [...idxs, idx] : idxs),
    [],
  );

  return departureColumns.reduce((product, idx) => product * yourTicket[idx], 1);
};
