fn main() {
    let input = include_str!("input.txt");
    println!("Solution 1, Part 1: {}", part1(input));
    println!("Solution 1, Part 2: {}", part2(input));
}

fn parse_memory_banks(input: &str) -> Vec<i32> {
    input.split("\t").map(|x| x.parse().unwrap()).collect()
}

fn redistribute(banks: &mut Vec<i32>) {
    let (mut idx, _) = banks.iter().enumerate().min_by_key(|&(_, b)| -b).unwrap();
    let mut blocks = banks[idx];
    banks[idx] = 0;

    while blocks > 0 {
        idx = (idx + 1) % banks.len();
        banks[idx] += 1;
        blocks -= 1;
    }
}

fn first_duplicate_redistribution(mut banks: Vec<i32>) -> (usize, usize) {
    let mut seen_positions = std::collections::HashMap::new();
    let mut cycles = 0;

    while !seen_positions.contains_key(&banks) {
        seen_positions.insert(banks.clone(), cycles);
        redistribute(&mut banks);
        cycles += 1;
    }

    return (cycles, cycles - seen_positions[&banks]);
}

fn part1(input: &str) -> usize {
    let (cycles, _) = first_duplicate_redistribution(parse_memory_banks(input));
    cycles
}

fn part2(input: &str) -> usize {
    let (_, cycle_position) = first_duplicate_redistribution(parse_memory_banks(input));
    cycle_position
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_part1() {
        assert_eq!(5, part1("0\t2\t7\t0"));
    }

    #[test]
    fn test_part2() {
        assert_eq!(4, part2("0\t2\t7\t0"));
    }
}
