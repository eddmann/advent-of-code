use self::DanceMove::*;
use std::str::FromStr;

fn main() {
    let input = include_str!("input.txt");
    println!("Solution 1, Part 1: {}", part1(input));
    println!("Solution 1, Part 2: {}", part2(input));
}

type Program = String;

#[derive(Debug, Copy, Clone)]
enum DanceMove {
    Spin(usize),
    Exchange(usize, usize),
    Partner(char, char),
}

impl FromStr for DanceMove {
    type Err = String;

    fn from_str(s: &str) -> Result<DanceMove, Self::Err> {
        let (dmove, drest) = s.split_at(1);
        let dargs: Vec<_> = drest.split("/").collect();

        match dmove {
            "s" => Ok(Spin(dargs[0].parse().expect("Spins"))),
            "x" => Ok(Exchange(
                dargs[0].parse().expect("Exchange A"),
                dargs[1].parse().expect("Exchange B"),
            )),
            "p" => Ok(Partner(
                dargs[0].parse().expect("Partner A"),
                dargs[1].parse().expect("Partner B"),
            )),
            _ => Err("Unknown dance move".to_string()),
        }
    }
}

impl DanceMove {
    fn from_sequence(sequence: &str) -> Vec<DanceMove> {
        sequence
            .split(",")
            .map(|m| m.parse().expect("Dance move"))
            .collect()
    }

    fn apply(self, program: &Program) -> Program {
        let mut nprogram: Vec<_> = program.chars().collect();

        match self {
            Spin(spins) => nprogram.rotate_right(spins),
            Exchange(a, b) => nprogram.swap(a, b),
            Partner(a, b) => {
                let a_idx = nprogram.iter().position(|&p| p == a).expect("Partner A");
                let b_idx = nprogram.iter().position(|&p| p == b).expect("Partner B");
                nprogram.swap(a_idx, b_idx)
            }
        };

        nprogram.iter().collect()
    }
}

fn dance(initial: &Program, sequence: Vec<DanceMove>) -> impl Iterator<Item = Program> {
    let succ = move |p: &Program| Some(sequence.iter().fold(p.to_string(), |p, m| m.apply(&p)));
    std::iter::successors(succ(initial), succ)
}

fn part1(input: &str) -> String {
    let starting = "abcdefghijklmnop".to_string();
    let sequence = DanceMove::from_sequence(input);

    dance(&starting, sequence)
        .next()
        .expect("Program arrangement")
}

fn part2(input: &str) -> String {
    let starting = "abcdefghijklmnop".to_string();
    let sequence = DanceMove::from_sequence(input);

    let cycle: Vec<_> = dance(&starting, sequence)
        .take_while(|p| *p != starting)
        .collect();

    cycle[1_000_000_000 % (cycle.len() + 1) - 1].clone()
}
