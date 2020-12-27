const MAX_KEY_SIZE = 20201227;

const calcLoopSize = (publicKey, subjectNumber = 7) => {
  let currentKey = 1;
  let loopSize = 0;

  while (currentKey !== publicKey) {
    currentKey = (currentKey * subjectNumber) % MAX_KEY_SIZE;
    loopSize += 1;
  }

  return loopSize;
};

const calcPrivateKey = (publicKey, loopSize) => {
  let privateKey = 1;

  while (loopSize--) {
    privateKey = (privateKey * publicKey) % MAX_KEY_SIZE;
  }

  return privateKey;
};

const part1 = (cardPublicKey, doorPublicKey) =>
  calcPrivateKey(cardPublicKey, calcLoopSize(doorPublicKey));

const [cardPublicKey, doorPublicKey] = require("fs")
  .readFileSync(process.argv[2], "utf-8")
  .split("\n")
  .map(Number);

console.log(part1(cardPublicKey, doorPublicKey));
