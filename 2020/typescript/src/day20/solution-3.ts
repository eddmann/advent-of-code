import { toInt, product, combinations } from '../helpers';

enum Point {
  Hash = '#',
  Dot = '.',
}
type Tile = {
  id: number;
  image: Point[][];
};
type Position = [row: number, col: number];
type Photo = Tile[][];

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

function* getEdges(tile: Tile): Generator<string> {
  yield tile.image[0].join('');
  yield tile.image.map(row => row[row.length - 1]).join('');
  yield tile.image[tile.image.length - 1].join('');
  yield tile.image.map(row => row[0]).join('');
}

const flipEdge = (edge: string) => edge.split('').reverse().join('');

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

function* getTransformations(tile: Tile): Generator<Tile> {
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

const toBorderlessTile = (photo: Photo): Tile => {
  const newImage: Point[][] = [];

  for (let row = 0; row < photo.length; row++) {
    for (let line = 1; line < photo[row][0].image.length - 1; line++) {
      let newLine = [];
      for (let col = 0; col < photo[0].length; col++) {
        const tileLine = photo[row][col].image[line];
        newLine.push(...tileLine.slice(1, tileLine.length - 1));
      }
      newImage.push(newLine);
    }
  }

  return { id: 0, image: newImage };
};

const calcWaterRoughness = (monster: string[], photo: Photo): number => {
  const photoTile = toBorderlessTile(photo);
  const totalHashes = photoTile.image.reduce((acc, row) => acc + row.filter(col => col === Point.Hash).length, 0);

  const monsterHashes: Position[] = [];
  for (let row = 0; row < monster.length; row++) {
    for (let col = 0; col < monster[row].length; col++) {
      if (monster[row][col] === Point.Hash) {
        monsterHashes.push([row, col]);
      }
    }
  }

  let totalMonsters = 0;
  for (const { image } of getTransformations(photoTile)) {
    for (let row = 0; row < image.length - monster.length; row++) {
      for (let col = 0; col < image[row].length - monster[0].length; col++) {
        if (monsterHashes.every(([mr, mc]) => image[row + mr][col + mc] === Point.Hash)) {
          totalMonsters += 1;
        }
      }
    }
  }

  return totalHashes - totalMonsters * monsterHashes.length;
};

export const part1 = (input: string): number => {
  const tiles = parseTiles(input);

  const edges = new Map<number, number>();

  for (const [tileA, tileB] of combinations(tiles, 2)) {
    for (const edgeA of getEdges(tileA)) {
      for (const edgeB of getEdges(tileB)) {
        if (edgeA === edgeB || flipEdge(edgeA) === edgeB) {
          edges.set(tileA.id, (edges.get(tileA.id) || 0) + 1);
          edges.set(tileB.id, (edges.get(tileB.id) || 0) + 1);
        }
      }
    }
  }

  const corners: number[] = [...edges.entries()].reduce((corners, [id, edges]) => {
    return edges === 2 ? [...corners, id] : corners;
  }, []);

  return corners.reduce(product);
};

export const part2 = (input: string): number => {
  const tiles = parseTiles(input);

  const photo = buildPhoto(tiles);
  // prettier-ignore
  const monster = [
    '                  # ',
    '#    ##    ##    ###',
    ' #  #  #  #  #  #   '
  ];

  return calcWaterRoughness(monster, photo);
};
