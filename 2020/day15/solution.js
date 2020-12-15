const findTurnNumber = (input, nth) => {
  const numbers = input.split(",").map(Number);

  let turn = numbers.length;
  let number = numbers.pop();
  const occurrences = new Map(numbers.map((num, idx) => [num, idx + 1]));

  while (turn < nth) {
    const next =
      turn - (occurrences.has(number) ? occurrences.get(number) : turn);
    occurrences.set(number, turn);
    number = next;
    turn += 1;
  }

  return number;
};

const input = "19,0,5,1,10,13";
console.log(findTurnNumber(input, 2020));
console.log(findTurnNumber(input, 30000000));
