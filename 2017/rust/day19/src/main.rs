use std::collections::HashMap;
use std::collections::HashSet;
use std::ops::Add;

fn main() {
    let input = include_str!("input.txt");
    println!("Solution 1, Part 1: {}", part1(input));
    println!("Solution 1, Part 2: {}", part2(input));
}

#[derive(Debug, Copy, Clone, Hash, Eq, PartialEq)]
struct Point2D(i32, i32);

impl Add for Point2D {
    type Output = Self;

    fn add(self, other: Self) -> Self {
        let Point2D(x, y) = self;
        let Point2D(ox, oy) = other;
        Self(x + ox, y + oy)
    }
}

type Value = char;
type Grid = HashMap<Point2D, Value>;
type Path = Vec<Value>;

fn parse_grid(input: &str) -> Grid {
    let mut grid = Grid::new();

    for (y, line) in input.split('\n').enumerate() {
        for (x, val) in line.chars().enumerate() {
            if val != ' ' {
                grid.insert(Point2D(x as i32, y as i32), val);
            }
        }
    }

    grid
}

fn travel(grid: Grid) -> Path {
    let mut path = Path::new();

    let mut position = *grid
        .keys()
        .find(|Point2D(_, y)| *y == 0)
        .expect("Starting position");
    let mut direction = Point2D(0, 1);
    let mut visited = HashSet::<Point2D>::new();

    while let Some(&value) = grid.get(&position) {
        visited.insert(position);
        path.push(value);

        if value == '+' {
            direction = *[Point2D(0, -1), Point2D(0, 1), Point2D(-1, 0), Point2D(1, 0)]
                .iter()
                .find(|&next_direction| {
                    let next_position = position + *next_direction;
                    grid.contains_key(&next_position) && !visited.contains(&next_position)
                })
                .expect("Next direction");
        }

        position = position + direction;
    }

    path
}

fn part1(input: &str) -> String {
    travel(parse_grid(input))
        .iter()
        .filter(|x| x.is_alphabetic())
        .collect()
}

fn part2(input: &str) -> usize {
    travel(parse_grid(input)).iter().count()
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_part1() {
        assert_eq!("ABCDEF", part1("    |          \n    |  +--+    \n    A  |  C    \nF---|--|-E---+ \n    |  |  |  D \n    +B-+  +--+ "))
    }

    #[test]
    fn test_part2() {
        assert_eq!(38, part2("    |          \n    |  +--+    \n    A  |  C    \nF---|--|-E---+ \n    |  |  |  D \n    +B-+  +--+ "))
    }
}
