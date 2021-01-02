enum Position {
  OccupiedSeat = '#',
  EmptySeat = 'L',
  Floor = '.',
}
type SeatLayout = Position[][];

const isPosition = (p: string): p is Position => ['#', 'L', '.'].includes(p);
const parseSeatLayout = (input: string): SeatLayout =>
  input.split('\n').map(row =>
    row.split('').map(position => {
      if (isPosition(position)) return position;
      throw new Error(`Invalid position ${position}`);
    }),
  );

const countOccupiedAdjacentSeats = (
  layout: SeatLayout,
  row: number,
  col: number,
  isSeatInSightCheck: boolean,
): number => {
  let count = 0;

  for (let rowOffset = -1; rowOffset <= 1; rowOffset++) {
    for (let colOffset = -1; colOffset <= 1; colOffset++) {
      if (rowOffset === 0 && colOffset === 0) continue;

      let currRow = row + rowOffset;
      let currCol = col + colOffset;

      while (currRow >= 0 && currCol >= 0 && currRow < layout.length && currCol < layout[0].length) {
        if (layout[currRow][currCol] === Position.OccupiedSeat) {
          count++;
          break;
        }

        if (layout[currRow][currCol] === Position.EmptySeat) {
          break;
        }

        if (!isSeatInSightCheck) break;

        currRow += rowOffset;
        currCol += colOffset;
      }
    }
  }

  return count;
};

const arrival = (layout: SeatLayout, minOccupiedSeats: number, isSeatInSightCheck: boolean): SeatLayout => {
  const newLayout: SeatLayout = [];

  for (let row = 0; row < layout.length; row++) {
    const newRow: Position[] = [];

    for (let col = 0; col < layout[0].length; col++) {
      const occupiedSeats = countOccupiedAdjacentSeats(layout, row, col, isSeatInSightCheck);
      const position = layout[row][col];

      if (position === Position.EmptySeat && occupiedSeats === 0) {
        newRow.push(Position.OccupiedSeat);
      } else if (position === Position.OccupiedSeat && occupiedSeats > minOccupiedSeats) {
        newRow.push(Position.EmptySeat);
      } else {
        newRow.push(position);
      }
    }

    newLayout.push(newRow);
  }

  return newLayout;
};

const isSameLayout = (a: SeatLayout, b: SeatLayout): boolean => a.flat().join('') === b.flat().join('');

const countOccupiedSeats = (layout: SeatLayout): number =>
  layout.flat().filter(position => position === Position.OccupiedSeat).length;

export const part1 = (input: string): number => {
  let layout = parseSeatLayout(input);

  while (true) {
    let nextLayout = arrival(layout, 3, false);
    if (isSameLayout(layout, nextLayout)) break;
    layout = nextLayout;
  }

  return countOccupiedSeats(layout);
};

export const part2 = (input: string): number => {
  let layout = parseSeatLayout(input);

  while (true) {
    let nextLayout = arrival(layout, 4, true);
    if (isSameLayout(layout, nextLayout)) break;
    layout = nextLayout;
  }

  return countOccupiedSeats(layout);
};
