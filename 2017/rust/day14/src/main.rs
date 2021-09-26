use std::collections::{HashSet, VecDeque};

fn main() {
    let input = include_str!("input.txt");
    println!("Solution 1, Part 1: {}", part1(input));
    println!("Solution 1, Part 2: {}", part2(input));
}

fn knot_hash(message: String) -> u128 {
    let mut bytes: Vec<u8> = message.bytes().collect();
    bytes.extend(&[17, 31, 73, 47, 23]);

    let sparse = {
        let mut rope: Vec<u8> = (0..=255).collect();
        let mut skip_size = 0;
        let mut current = 0;

        for _ in 0..64 {
            for &byte in &bytes {
                for idx in 0..(byte / 2) as usize {
                    rope.swap(
                        (current + idx) % 256,
                        (current + byte as usize - 1 - idx) % 256,
                    );
                }

                current += byte as usize + skip_size;
                skip_size += 1;
            }
        }

        rope
    };

    sparse
        .chunks(16)
        .rev()
        .enumerate()
        .fold(0, |dense, (idx, chunk)| {
            let compressed = chunk.iter().fold(0, |hash, &bit| hash ^ bit as u8) as u128;
            dense | compressed << 8 * idx
        })
}

fn calc_row(hash: u128) -> Vec<bool> {
    format!("{:x}", hash)
        .chars()
        .flat_map(|hex| {
            format!(
                "{:04b}",
                u8::from_str_radix(&hex.to_string(), 16).expect("")
            )
            .chars()
            .map(|bit| bit == '1')
            .collect::<Vec<bool>>()
        })
        .rev()
        .collect()
}

#[derive(Debug, Copy, Clone, Hash, Eq, PartialEq)]
struct Square(i32, i32);

impl Square {
    fn neighbours(self) -> [Square; 4] {
        let Square(x, y) = self;
        [
            Square(x + 1, y),
            Square(x, y + 1),
            Square(x - 1, y),
            Square(x, y - 1),
        ]
    }
}

type Grid = HashSet<Square>;

fn build_grid(key: &str) -> Grid {
    let rows: Vec<_> = (0..=127)
        .map(|idx| knot_hash(format!("{}-{}", key, idx)))
        .collect();

    let mut grid = Grid::new();

    for (x, &row) in rows.iter().enumerate() {
        for (y, &bit) in calc_row(row).iter().enumerate() {
            if bit {
                grid.insert(Square(x as i32, y as i32));
            }
        }
    }

    grid
}

fn part1(input: &str) -> usize {
    build_grid(input).len()
}

fn part2(input: &str) -> usize {
    let mut grid = build_grid(input);
    let mut regions = 0;

    while let Some(&origin_square) = grid.iter().next() {
        let mut queue = VecDeque::new();
        queue.push_back(origin_square);

        while let Some(next_square) = queue.pop_front() {
            grid.remove(&next_square);

            for neighbour_squaue in &next_square.neighbours() {
                if grid.contains(&neighbour_squaue) {
                    queue.push_back(neighbour_squaue.clone());
                }
            }
        }

        regions += 1;
    }

    regions
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_part1() {
        assert_eq!(8108, part1("flqrgnkx"))
    }

    #[test]
    fn test_part2() {
        assert_eq!(1242, part2("flqrgnkx"))
    }
}
