fn main() {
    let input = std::include_str!("input.txt");
    println!("Solution 1, Part 1: {}", part1(input));
    println!("Solution 1, Part 2: {}", part2(input));
}

fn parse_numbers(input: &str) -> Vec<Vec<i32>> {
    input
        .lines()
        .map(|row| {
            row.split_ascii_whitespace()
                .map(|col| col.parse::<i32>())
                .collect::<Result<Vec<_>, _>>()
        })
        .collect::<Result<Vec<_>, _>>()
        .unwrap()
}

fn part1(input: &str) -> i32 {
    parse_numbers(input)
        .iter()
        .map(|row| *row.iter().max().unwrap() - *row.iter().min().unwrap())
        .sum::<i32>()
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
        .sum::<i32>()
}
