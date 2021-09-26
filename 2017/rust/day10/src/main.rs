fn main() {
    let input = include_str!("input.txt");
    println!("Solution 1, Part 1: {}", part1(input));
    println!("Solution 1, Part 2: {}", part2(input));
}

fn reverse(lengths: &Vec<u8>, rope: &mut Vec<u16>, rounds: u8) {
    let rope_length = rope.len();

    let mut skip_size = 0;
    let mut current = 0;

    for _ in 0..rounds {
        for &length in lengths {
            for idx in 0..(length / 2) as usize {
                rope.swap(
                    (current + idx) % rope_length,
                    (current + length as usize - 1 - idx) % rope_length,
                );
            }

            current += length as usize + skip_size;
            skip_size += 1;
        }
    }
}

fn part1(input: &str) -> u16 {
    let parts: Vec<_> = input.lines().collect();
    let lengths = parts[0]
        .split(",")
        .map(|length| length.parse::<u8>().expect("Knot length"))
        .collect();
    let mut rope = (0..parts[1].parse::<u16>().expect("Rope length")).collect();

    reverse(&lengths, &mut rope, 1);

    rope[0] * rope[1]
}

fn part2(input: &str) -> String {
    let parts: Vec<_> = input.lines().collect();

    let mut lengths: Vec<u8> = parts[0].bytes().collect();
    let mut rope = (0..parts[1].parse::<u16>().expect("Rope length")).collect();

    lengths.extend(&[17, 31, 73, 47, 23]);

    reverse(&lengths, &mut rope, 64);

    let densh_hash = rope
        .chunks(16)
        .rev()
        .enumerate()
        .fold(0, |hash, (idx, chunk)| {
            let dense = chunk.iter().fold(0, |hash, &bit| hash ^ bit as u8) as u128;
            hash | dense << 8 * idx
        });

    format!("{:x}", densh_hash)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_part1() {
        assert_eq!(12, part1("3,4,1,5\n5"));
    }

    #[test]
    fn test_part2() {
        assert_eq!("a2582a3a0e66e6e86e3812dcb672a272", part2("\n256"));
        assert_eq!("33efeb34ea91902bb2f59c9920caa6cd", part2("AoC 2017\n256"));
        assert_eq!("3efbe78a8d82f29979031a4aa0b16a9d", part2("1,2,3\n256"));
        assert_eq!("63960835bcdc130f0b66d7ff4f6a5a8e", part2("1,2,4\n256"));
    }
}
