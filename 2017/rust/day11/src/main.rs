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

fn path(input: &str) -> Vec<Steps> {
    input
        .split(',')
        .scan(Point2D(0, 0), |pos, dir| {
            *pos = pos.step(dir);
            Some((pos.0.abs() + pos.1.abs() + (pos.0 + pos.1).abs()) / 2)
        })
        .collect()
}

fn part1(input: &str) -> i32 {
    *path(input).last().expect("Fewest steps away")
}

fn part2(input: &str) -> i32 {
    *path(input).iter().max().expect("Furthest steps away")
}
