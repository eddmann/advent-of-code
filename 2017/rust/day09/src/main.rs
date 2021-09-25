fn main() {
    let input = include_str!("input.txt");
    println!("Solution 1, Part 1: {}", part1(input));
    println!("Solution 1, Part 2: {}", part2(input));
}

fn part1(input: &str) -> usize {
    let mut tokens = input.chars();
    let mut group_depth = 0;
    let mut is_within_garbage = false;
    let mut score = 0;

    while let Some(token) = tokens.next() {
        match token {
            '!' => {
                tokens.next();
            }
            '>' if is_within_garbage => is_within_garbage = false,
            '<' => is_within_garbage = true,
            _ if is_within_garbage => (),
            '{' => {
                group_depth += 1;
                score += group_depth;
            }
            '}' => group_depth -= 1,
            _ => (),
        }
    }

    score
}

fn part2(input: &str) -> usize {
    let mut tokens = input.chars();
    let mut is_within_garbage = false;
    let mut garbage = 0;

    while let Some(token) = tokens.next() {
        match token {
            '!' => {
                tokens.next();
            }
            '>' if is_within_garbage => is_within_garbage = false,
            _ if is_within_garbage => garbage += 1,
            '<' => is_within_garbage = true,
            _ => (),
        }
    }

    garbage
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_part1() {
        assert_eq!(1, part1("{}"));
        assert_eq!(6, part1("{{{}}}"));
        assert_eq!(5, part1("{{},{}}"));
        assert_eq!(16, part1("{{{},{},{{}}}}"));
        assert_eq!(1, part1("{<a>,<a>,<a>,<a>}"));
        assert_eq!(9, part1("{{<ab>},{<ab>},{<ab>},{<ab>}}"));
        assert_eq!(9, part1("{{<!!>},{<!!>},{<!!>},{<!!>}}"));
        assert_eq!(3, part1("{{<a!>},{<a!>},{<a!>},{<ab>}}"));
    }

    #[test]
    fn test_part2() {
        assert_eq!(0, part2("<>"));
        assert_eq!(17, part2("<random characters>"));
        assert_eq!(3, part2("<<<<>"));
        assert_eq!(2, part2("<{!>}>"));
        assert_eq!(0, part2("<!!>"));
        assert_eq!(0, part2("<!!!>>"));
        assert_eq!(10, part2("<{o\"i!a,<{i<a>"));
    }
}
