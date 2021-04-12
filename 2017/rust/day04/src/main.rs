use std::iter::FromIterator;

fn main() {
    let input = std::include_str!("input.txt");
    println!("Solution 1, Part 1: {}", part1(input));
    println!("Solution 1, Part 2: {}", part2(input));
}

fn is_valid(to_key: fn(String) -> String, passphrase: &str) -> bool {
    let mut seen = std::collections::HashSet::new();

    for word in passphrase.split_whitespace() {
        if !seen.insert(to_key(word.to_string())) {
            return false
        }
    }

    true
}

fn part1(input: &str) -> usize {
    input
        .lines()
        .filter(|passphrase| is_valid(std::convert::identity, passphrase))
        .count()
}

fn part2(input: &str) -> usize {
    let to_anagram_key = |word: String| {
        let mut chars: Vec<char> = word.chars().collect();
        chars.sort();
        String::from_iter(chars)
    };

    input
        .lines()
        .filter(|passphrase| is_valid(to_anagram_key, passphrase))
        .count()
}
