const toSeatId = (boardingPass: string): number => {
  const [row, column] = [boardingPass.slice(0, 7), boardingPass.slice(7)];
  return (
    parseInt(row.replace(/F/g, '0').replace(/B/g, '1'), 2) * 8 +
    parseInt(column.replace(/L/g, '0').replace(/R/g, '1'), 2)
  );
};

export const part1 = (input: string): number => {
  const seatIds = input.split('\n').map(toSeatId);
  return Math.max(...seatIds);
};

export const part2 = (input: string): number => {
  const seatIds = input
    .split('\n')
    .map(toSeatId)
    .sort((a, b) => a - b);

  for (let i = 1; i < seatIds.length; i++) {
    if (seatIds[i] - seatIds[i - 1] !== 1) {
      return seatIds[i] - 1;
    }
  }

  return -1;
};
