fn main() {
    let input = include_str!("input.txt");
    println!("Solution 1, Part 1: {}", part1(input));
    println!("Solution 1, Part 2: {}", part2(input));
}

struct Point2D(i32, i32);

impl Point2D {
    fn step(&self, dir: &str) -> Self {
        let direction = match dir {
            "n" => Point2D(0, 1),
            "ne" => Point2D(1, 0),
            "se" => Point2D(1, -1),
            "s" => Point2D(0, -1),
            "sw" => Point2D(-1, 0),
            "nw" => Point2D(-1, 1),
            _ => panic!("Unknown direction"),
        };

        Point2D(self.0 + direction.0, self.1 + direction.1)
    }
}

type Steps = i32;

fn path(input: &str) -> impl Iterator<Item = Steps> + '_ {
    input.split(',').scan(Point2D(0, 0), |pos, dir| {
        *pos = pos.step(dir);
        Some((pos.0.abs() + pos.1.abs() + (pos.0 + pos.1).abs()) / 2)
    })
}

fn part1(input: &str) -> i32 {
    path(input).last().expect("Fewest steps away")
}

fn part2(input: &str) -> i32 {
    path(input).max().expect("Furthest steps away")
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_path() {
        assert_eq!(3, path("ne,ne,ne").last().unwrap());
        assert_eq!(0, path("ne,ne,sw,sw").last().unwrap());
        assert_eq!(2, path("ne,ne,s,s").last().unwrap());
        assert_eq!(3, path("se,sw,se,sw,sw").last().unwrap());
    }
}
