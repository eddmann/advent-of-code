fn main() {
    let input = include_str!("input.txt");
    println!("Solution 1, Part 1: {}", part1(input));
}

type State = char;
type Direction = i32;

struct Transition {
    value: bool,
    direction: Direction,
    next: State,
}

type Transitions = std::collections::HashMap<State, [Transition; 2]>;

fn parse_transition(section: &str) -> (State, [Transition; 2]) {
    let parts: Vec<_> = section
        .replace("right", "r")
        .split('\n')
        .map(|line| line.chars().rev().nth(1).expect("Transition property"))
        .collect();

    (
        parts[0],
        [
            Transition {
                value: parts[2] == '1',
                direction: if parts[3] == 'r' { 1 } else { -1 },
                next: parts[4],
            },
            Transition {
                value: parts[6] == '1',
                direction: if parts[7] == 'r' { 1 } else { -1 },
                next: parts[8],
            },
        ],
    )
}

fn parse_transitions(input: &str) -> Transitions {
    let sections: Vec<_> = input.split("\n\n").collect();

    sections[1..]
        .iter()
        .map(|section| parse_transition(section))
        .collect()
}

fn part1(input: &str) -> usize {
    let transitions = parse_transitions(input);

    let mut pointer = 0;
    let mut state = 'A';
    let mut tape = std::collections::HashSet::<i32>::new();

    for _ in 0..12523873 {
        let transition =
            &transitions.get(&state).expect("State")[if tape.contains(&pointer) { 1 } else { 0 }];

        if transition.value {
            tape.insert(pointer);
        } else {
            tape.remove(&pointer);
        }

        state = transition.next;
        pointer += transition.direction;
    }

    tape.len()
}
