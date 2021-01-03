import { toInt, MapSet } from '../helpers';

enum Point {
  Hash = '#',
  Dot = '.',
  Empty = ' ',
}
type Tile = {
  id: number;
  image: Point[][];
};
type Position = [row: number, col: number];
type Photo = Tile[][];
type BorderlessPhoto = Point[][];

const isPoint = (point: string): point is Point => ['.', '#', ' '].includes(point);
const parseTile = (tile: string): Tile => {
  const [, id, image] = tile.trim().match(/Tile (\d+):\n([\s\S]+)/m);
  return {
    id: toInt(id),
    image: image.split('\n').map(row =>
      row.split('').map(point => {
        if (isPoint(point)) return point;
        throw new Error(`Invalid point ${point}`);
      }),
    ),
  };
};
export const parseTiles = (input: string): Tile[] => input.split('\n\n').map(parseTile);

const rotateClockwise = ({ id, image }: Tile): Tile => {
  const newImage: Point[][] = Array.from({ length: image[0].length }).map(() => Array(image.length).fill(Point.Dot));

  for (let col = 0; col < image[0].length; col++) {
    for (let row = 0; row < image.length; row++) {
      newImage[col][image.length - row - 1] = image[row][col];
    }
  }

  return { id, image: newImage };
};

const flipVertical = ({ id, image }: Tile): Tile => {
  const newImage: Point[][] = Array.from({ length: image[0].length }).map(() => Array(image.length).fill(Point.Dot));

  for (let row = 0; row < image.length / 2; row++) {
    newImage[row] = image[image.length - row - 1];
    newImage[image.length - row - 1] = image[row];
  }

  return { id, image: newImage };
};

export function* getTransformations(tile: Tile): Generator<Tile> {
  let flips = 2;
  while (flips--) {
    let rotations = 4;
    while (rotations--) {
      tile = rotateClockwise(tile);
      yield tile;
    }
    tile = flipVertical(tile);
  }
}

const isTopMatch = ({ image: placed }: Tile, { image: subject }: Tile): boolean =>
  placed[placed.length - 1].join('') === subject[0].join('');

const isLeftSideMatch = ({ image: placed }: Tile, { image: subject }: Tile): boolean =>
  placed.map(row => row[row.length - 1]).join('') === subject.map(row => row[0]).join('');

const isTileFit = (photo: Photo, tile: Tile, [row, col]: Position): boolean => {
  return (
    (row === 0 || isTopMatch(photo[row - 1][col], tile)) && (col === 0 || isLeftSideMatch(photo[row][col - 1], tile))
  );
};

const buildPhotoAt = (tiles: Tile[], photo: Photo, [row, col]: Position): Photo | null => {
  if (col === photo[0].length) {
    col = 0;
    row++;
  }

  if (row === photo.length) {
    return photo;
  }

  for (let i = 0; i < tiles.length; i++) {
    for (const tile of getTransformations(tiles[i])) {
      if (isTileFit(photo, tile, [row, col])) {
        const newPhoto = photo.map(row => row.slice());
        newPhoto[row][col] = tile;

        const result = buildPhotoAt(
          tiles.filter(({ id }) => id !== tile.id),
          newPhoto,
          [row, col + 1],
        );

        if (result) {
          return result;
        }
      }
    }
  }

  return null;
};

const buildPhoto = (tiles: Tile[]): Photo | null => {
  const photo: Photo = Array.from({ length: Math.sqrt(tiles.length) }).map(() =>
    Array(Math.sqrt(tiles.length)).fill(undefined),
  );

  return buildPhotoAt(tiles, photo, [0, 0]);
};

const productOfCorners = (photo: Photo): number => {
  return (
    photo[0][0].id *
    photo[0][photo[0].length - 1].id *
    photo[photo.length - 1][0].id *
    photo[photo.length - 1][photo[0].length - 1].id
  );
};

const toBorderlessPhoto = (photo: Photo): BorderlessPhoto => {
  const newPhoto: BorderlessPhoto = [];

  for (let row = 0; row < photo.length; row++) {
    for (let line = 1; line < photo[row][0].image.length - 1; line++) {
      let newLine = [];
      for (let col = 0; col < photo[0].length; col++) {
        const tileLine = photo[row][col].image[line];
        newLine.push(...tileLine.slice(1, tileLine.length - 1));
      }
      newPhoto.push(newLine);
    }
  }

  return newPhoto;
};

const findMonsterHashesAt = (monster: Tile, photo: BorderlessPhoto, [rowB, colB]: Position): MapSet<Position> => {
  const hashes = new MapSet<Position>();

  for (let rowM = 0; rowM < monster.image.length; rowM++) {
    for (let colM = 0; colM < monster.image[0].length; colM++) {
      if (monster.image[rowM][colM] === Point.Hash) {
        if (photo[rowB + rowM][colB + colM] === Point.Dot) return new MapSet();
        hashes.add([rowB + rowM, colB + colM]);
      }
    }
  }

  return hashes;
};

const findMonsterHashes = (monster: Tile, photo: BorderlessPhoto): MapSet<Position> => {
  let hashes = new MapSet<Position>();

  for (let row = 0; row < photo.length - monster.image.length + 1; row++) {
    for (let col = 0; col < photo[row].length - monster.image[0].length + 1; col++) {
      hashes = new MapSet<Position>([...hashes, ...findMonsterHashesAt(monster, photo, [row, col])]);
    }
  }

  return hashes;
};

const calcWaterRoughness = (monster: Tile, photo: Photo): number => {
  const borderlessPhoto = toBorderlessPhoto(photo);

  const totalHashes = borderlessPhoto.reduce((acc, row) => acc + row.filter(col => col === Point.Hash).length, 0);
  const monsterHashes = [...getTransformations(monster)].reduce(
    (hashes, monster) => new MapSet([...hashes, ...findMonsterHashes(monster, borderlessPhoto)]),
    new MapSet<Position>(),
  );

  return totalHashes - monsterHashes.size;
};

export const part1 = (input: string): number => {
  const tiles = parseTiles(input);

  return productOfCorners(buildPhoto(tiles));
};

export const part2 = (input: string): number => {
  const tiles = parseTiles(input);

  const photo = buildPhoto(tiles);
  const monster = parseTile(`Tile 0:\n                  # \n#    ##    ##    ###\n #  #  #  #  #  #   `);

  return calcWaterRoughness(monster, photo);
};
