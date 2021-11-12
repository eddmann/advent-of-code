use std::collections::{HashMap, HashSet, VecDeque};

fn main() {
    let input = include_str!("input.txt");
    println!("Solution 1, Part 1: {}", part1(input));
    println!("Solution 1, Part 2: {}", part2(input));
}

type Id = usize;
type DirectIds = HashSet<Id>;
type GroupIds = HashSet<Id>;
type Pipes = HashMap<Id, DirectIds>;

fn parse_pipes(input: &str) -> Pipes {
    input
        .split('\n')
        .map(|line| {
            let parts: Vec<_> = line.split(" <-> ").collect();
            (
                parts[0].parse().expect("Pipe id"),
                parts[1]
                    .split(", ")
                    .map(|direct| direct.parse().expect("Direct pipe id"))
                    .collect(),
            )
        })
        .collect()
}

fn find_group_ids(root: Id, pipes: &Pipes) -> GroupIds {
    let mut queue = VecDeque::new();
    queue.push_back(root);

    let mut group = GroupIds::new();

    while let Some(id) = queue.pop_front() {
        if !group.insert(id) {
            continue;
        }

        if let Some(direct_ids) = pipes.get(&id) {
            for direct_id in direct_ids {
                queue.push_back(*direct_id);
            }
        }
    }

    group
}

fn part1(input: &str) -> usize {
    find_group_ids(0, &parse_pipes(input)).len()
}

fn part2(input: &str) -> usize {
    let pipes = parse_pipes(input);

    let mut pipe_ids: GroupIds = pipes.keys().cloned().collect();
    let mut total_groups = 0;

    while !pipe_ids.is_empty() {
        let root = *pipe_ids.iter().next().expect("Remaining pipe id");

        for id in find_group_ids(root, &pipes) {
            pipe_ids.remove(&id);
        }

        total_groups += 1;
    }

    total_groups
}
