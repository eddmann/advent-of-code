fn main() {
    let input = include_str!("../input.txt");
    println!("Solution 2, Part 1: {}", part1(input));
    println!("Solution 2, Part 2: {}", part2(input));
}

type Layer = (usize, usize);

fn parse_firewall(input: &str) -> Vec<Layer> {
    input
        .lines()
        .map(|line| {
            let mut parts = line.split(": ");
            let depth = parts.next().unwrap().parse::<usize>().unwrap();
            let range = parts.next().unwrap().parse::<usize>().unwrap();
            (depth, range)
        })
        .collect()
}

/// Workings
///
/// Example: scanner with range of 4
/// p0 -> 0 *
/// p1 -> 1
/// p2 -> 2
/// p3 -> 3
/// p4 -> 2
/// p5 -> 1
/// p6 -> 0 *
/// Note: only care about * holding up
///
/// Solution
///
/// Double range to cater for forward/backwards, -1 to skip staying at end more than one step
/// Formula: picosecond % ((range - 1) * 2)
///
/// p0 -> 0 % ((4 - 1) * 2) 0 *
/// p1 -> 1 % ((4 - 1) * 2) 1
/// p2 -> 2 % ((4 - 1) * 2) 2
/// p3 -> 3 % ((4 - 1) * 2) 3
/// p4 -> 4 % ((4 - 1) * 2) 4 (don't care)
/// p5 -> 5 % ((4 - 1) * 2) 5 (don't care)
/// p6 -> 6 % ((4 - 1) * 2) 0 *

fn is_caught(picosecond: usize, range: usize) -> bool {
    picosecond % ((range - 1) * 2) == 0
}

fn part1(input: &str) -> usize {
    let firewall = parse_firewall(input);
    firewall
        .iter()
        .filter_map(|&(depth, range)| {
            if is_caught(depth, range) {
                Some(depth * range)
            } else {
                None
            }
        })
        .sum()
}

fn part2(input: &str) -> usize {
    let firewall = parse_firewall(input);
    (0..)
        .find(|delay| {
            firewall
                .iter()
                .all(|&(depth, range)| !is_caught(depth + delay, range))
        })
        .unwrap()
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_part1() {
        assert_eq!(24, part1("0: 3\n1: 2\n4: 4\n6: 4"));
    }

    #[test]
    fn test_part2() {
        assert_eq!(10, part2("0: 3\n1: 2\n4: 4\n6: 4"));
    }
}
