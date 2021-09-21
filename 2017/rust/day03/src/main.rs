use std::collections::HashMap;
use std::ops::Add;

fn main() {
    let input = std::include_str!("input.txt").parse::<i32>().unwrap();
    println!("Solution 1, Part 1: {}", solution1_part1(input));
    println!("Solution 1, Part 2: {}", solution1_part2(input));
    println!("Solution 2, Part 1: {}", solution2_part1(input));
    println!("Solution 2, Part 2: {}", solution2_part2(input));
}

#[derive(Debug, Copy, Clone, Hash, Eq, PartialEq)]
struct Point2D {
    x: i32,
    y: i32,
}

impl Point2D {
    fn zero() -> Self {
        Point2D { x: 0, y: 0 }
    }

    fn rotate_left(self) -> Self {
        Point2D {
            x: -self.y,
            y: self.x,
        }
    }

    fn neighbours(self) -> Vec<Self> {
        vec![
            self + Point2D { x: 1, y: 0 },
            self + Point2D { x: 0, y: 1 },
            self + Point2D { x: 0, y: -1 },
            self + Point2D { x: -1, y: 0 },
            self + Point2D { x: -1, y: 1 },
            self + Point2D { x: 1, y: -1 },
            self + Point2D { x: 1, y: 1 },
            self + Point2D { x: -1, y: -1 },
        ]
    }
}

impl Add for Point2D {
    type Output = Self;

    fn add(self, other: Self) -> Self {
        Self {
            x: self.x + other.x,
            y: self.y + other.y,
        }
    }
}

fn solution1_part1(input: i32) -> i32 {
    let mut dx = 1;
    let mut dy = 0;

    let mut x: i32 = 0;
    let mut y: i32 = 0;

    let mut total_steps = 1;
    let mut steps = 0;

    for number in 1..=input {
        if number == input {
            return x.abs() + y.abs();
        }

        x += dx;
        y += dy;
        steps += 1;

        if steps == total_steps {
            steps = 0;
            let tmp = dx;
            dx = -dy;
            dy = tmp;
            if dy == 0 {
                total_steps += 1;
            }
        }
    }

    return 0;
}

fn solution2_part1(input: i32) -> i32 {
    let mut map = HashMap::new();

    let mut pos = Point2D::zero();
    let mut dir = Point2D { x: 1, y: 0 };

    for i in 1..input {
        map.insert(pos, i);

        if !map.contains_key(&(pos + dir.rotate_left())) {
            dir = dir.rotate_left();
        }

        pos = pos + dir;
    }

    return pos.x.abs() + pos.y.abs();
}

fn solution1_part2(input: i32) -> i32 {
    let mut map = HashMap::new();

    let mut dx = 1;
    let mut dy = 0;

    let mut x: i32 = 0;
    let mut y: i32 = 0;

    let mut total_steps = 1;
    let mut steps = 0;

    map.insert((x, y), 1);

    for _ in 1.. {
        x += dx;
        y += dy;
        steps += 1;

        let mut number = 0;
        for nx in -1..=1 {
            for ny in -1..=1 {
                if nx == 0 && ny == 0 {
                    continue;
                }
                number += map.get(&(x + nx, y + ny)).unwrap_or(&0);
            }
        }

        if number > input {
            return number;
        }

        map.insert((x, y), number);

        if steps == total_steps {
            steps = 0;
            let tmp = dx;
            dx = -dy;
            dy = tmp;
            if dy == 0 {
                total_steps += 1;
            }
        }
    }

    return 0;
}

fn solution2_part2(input: i32) -> i32 {
    let mut map = HashMap::new();
    map.insert(Point2D::zero(), 1);

    let mut pos = Point2D { x: 1, y: 0 };
    let mut dir = Point2D { x: 1, y: 0 };

    loop {
        let number = pos
            .neighbours()
            .iter()
            .map(|p| map.get(p).unwrap_or(&0))
            .sum();

        if number > input {
            return number;
        }

        map.insert(pos, number);

        if !map.contains_key(&(pos + dir.rotate_left())) {
            dir = dir.rotate_left();
        }

        pos = pos + dir;
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_part1() {
        assert_eq!(326, solution1_part1(361527));
        assert_eq!(326, solution2_part1(361527));
    }

    #[test]
    fn test_part2() {
        assert_eq!(363010, solution1_part2(361527));
        assert_eq!(363010, solution2_part2(361527));
    }
}
