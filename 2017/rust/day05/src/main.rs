fn main() {
    let input = include_str!("input.txt");
    println!("Solution 1, Part 1: {}", part1(input));
    println!("Solution 1, Part 2: {}", part2(input));
}

fn parse_instructions(input: &str) -> Vec<isize> {
    input.lines().map(|x| x.parse().unwrap()).collect()
}

fn count_steps(input: &str, apply_offset: fn(isize) -> isize) -> usize {
    let mut instructions = parse_instructions(input);
    let mut position: isize = 0;
    let mut steps = 0;

    while let Some(instruction) = instructions.get_mut(position as usize) {
        position += *instruction;
        *instruction += apply_offset(*instruction);
        steps += 1;
    }

    steps
}

fn part1(input: &str) -> usize {
    count_steps(input, |_| 1)
}

fn part2(input: &str) -> usize {
    count_steps(input, |instruction| if instruction < 3 { 1 } else { -1 })
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_part1() {
        assert_eq!(5, part1("0\n3\n0\n1\n-3"));
    }

    #[test]
    fn test_part2() {
        assert_eq!(5, part1("0\n3\n0\n1\n-3"));
    }
}
