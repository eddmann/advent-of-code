fn main() {
    let input = include_str!("input.txt");
    println!("Solution 1, Part 1: {}", part1(input));
    println!("Solution 1, Part 2: {}", part2(input));
}

fn parse_numbers(input: &str) -> Vec<Vec<i32>> {
    input
        .lines()
        .map(|row| {
            row.split_whitespace()
                .map(|col| col.parse().unwrap())
                .collect()
        })
        .collect()
}

fn part1(input: &str) -> i32 {
    parse_numbers(input)
        .iter()
        .map(|row| row.iter().max().unwrap() - row.iter().min().unwrap())
        .sum()
}

fn part2(input: &str) -> i32 {
    parse_numbers(input)
        .iter()
        .map(|row| {
            for (idx, a) in row.iter().enumerate() {
                for b in &row[idx + 1..] {
                    let (dividend, divisor) = (std::cmp::max(a, b), std::cmp::min(a, b));
                    if dividend % divisor == 0 {
                        return dividend / divisor;
                    }
                }
            }

            return 0;
        })
        .sum()
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_part1() {
        assert_eq!(18, part1("5 1 9 5\n7 5 3\n2 4 6 8"));
    }

    #[test]
    fn test_part2() {
        assert_eq!(9, part2("5 9 2 8\n9 4 7 3\n3 8 6 5"));
    }
}
