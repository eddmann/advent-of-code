use std::collections::HashMap;
use std::collections::HashSet;

fn main() {
    let input = include_str!("input.txt");
    println!("Solution 1, Part 1: {}", part1(input));
    println!("Solution 1, Part 2: {}", part2(input));
}

type Name = String;
type Weight = usize;

#[derive(Debug)]
struct Disc {
    name: Name,
    weight: Weight,
    children: Vec<Name>,
}

type Discs = HashMap<Name, Disc>;

fn parse_discs(input: &str) -> Discs {
    input
        .split('\n')
        .map(|line| {
            let attr_and_children: Vec<_> = line.split(" -> ").collect();
            let name_and_weight: Vec<_> = attr_and_children[0].split(" (").collect();
            (
                name_and_weight[0].to_string(),
                Disc {
                    name: name_and_weight[0].to_string(),
                    weight: name_and_weight[1].replace(")", "").parse().expect(""),
                    children: match attr_and_children.get(1) {
                        Some(children) => children
                            .split(", ")
                            .map(|child| child.to_string())
                            .collect(),
                        None => vec![],
                    },
                },
            )
        })
        .collect()
}

fn find_root_name(discs: &Discs) -> Name {
    let all_discs: HashSet<_> = discs.keys().cloned().collect();
    let child_discs: HashSet<_> = discs
        .values()
        .flat_map(|disc| disc.children.clone())
        .collect();
    all_discs.difference(&child_discs).collect::<Vec<_>>()[0].to_string()
}

fn weight(name: &Name, discs: &Discs) -> Weight {
    let disc = discs.get(name).expect("Disc");

    disc.weight
        + disc
            .children
            .iter()
            .map(|child| weight(&child, discs))
            .sum::<Weight>()
}

fn calc_rebalanced_weight(name: &Name, discs: &Discs) -> Option<Weight> {
    let disc = discs.get(name).expect("Disc");

    let mut child_weights: Vec<(Name, Weight)> = vec![];

    for child in &disc.children {
        if let Some(weight) = calc_rebalanced_weight(child, discs) {
            return Some(weight);
        }

        child_weights.push((child.to_string(), weight(child, discs)));
    }

    let min_weight = child_weights.iter().min_by(|(_, w1), (_, w2)| w1.cmp(w2));
    let max_weight = child_weights.iter().max_by(|(_, w1), (_, w2)| w1.cmp(w2));

    match (min_weight, max_weight) {
        (Some((_, min)), Some((max_name, max))) if min != max => {
            return Some(discs.get(max_name).expect("Unbalanced disc").weight - (max - min))
        }
        _ => None,
    }
}

fn part1(input: &str) -> Name {
    let discs = parse_discs(input);
    find_root_name(&discs)
}

fn part2(input: &str) -> Weight {
    let discs = parse_discs(input);
    let root = find_root_name(&discs);
    calc_rebalanced_weight(&root, &discs).expect("Balanced disc weight")
}
