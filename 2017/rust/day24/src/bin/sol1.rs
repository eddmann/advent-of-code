use std::cmp::Ordering;
use std::collections::HashSet;

fn main() {
    let input = include_str!("../input.txt");
    println!("Solution 1, Part 1: {}", part1(input));
    println!("Solution 1, Part 2: {}", part2(input));
}

#[derive(Clone, Eq, PartialEq, Hash, Copy)]
struct Component(usize, usize);

#[derive(Clone)]
struct Bridge {
    components: HashSet<Component>,
    strength: usize,
    length: usize,
}

impl Bridge {
    fn new() -> Self {
        Bridge {
            components: HashSet::new(),
            strength: 0,
            length: 0,
        }
    }

    fn add(&mut self, component: Component) {
        self.components.insert(component);
        self.strength += component.0 + component.1;
        self.length += 1;
    }

    fn remove(&mut self, component: Component) {
        self.components.remove(&component);
        self.strength -= component.0 + component.1;
        self.length -= 1;
    }
}

type BridgeComparator = fn(a: &Bridge, b: &Bridge) -> Ordering;

fn parse_components(input: &str) -> Vec<Component> {
    input
        .split('\n')
        .map(|component| {
            let ports: Vec<_> = component.split('/').collect();
            Component(
                ports[0].parse().expect("Port 1"),
                ports[1].parse().expect("Port 2"),
            )
        })
        .collect()
}

fn calc_max_bridge(components: &Vec<Component>, comparator: BridgeComparator) -> Bridge {
    fn recur(
        components: &Vec<Component>,
        comparator: BridgeComparator,
        port: usize,
        bridge: &mut Bridge,
    ) -> Bridge {
        components
            .iter()
            .filter_map(|&component| match component {
                _ if bridge.components.contains(&component) => None,
                Component(p1, p2) if p1 == port || p2 == port => {
                    bridge.add(component);

                    let max_bridge = recur(
                        components,
                        comparator,
                        if p1 == port { p2 } else { p1 },
                        bridge,
                    );

                    bridge.remove(component);

                    Some(max_bridge)
                }
                _ => None,
            })
            .max_by(comparator)
            .unwrap_or(bridge.clone())
    }

    recur(components, comparator, 0, &mut Bridge::new())
}

fn part1(input: &str) -> usize {
    calc_max_bridge(&parse_components(input), |a, b| a.strength.cmp(&b.strength)).strength
}

fn part2(input: &str) -> usize {
    calc_max_bridge(&parse_components(input), |a, b| {
        match a.length.cmp(&b.length) {
            Ordering::Equal => a.strength.cmp(&b.strength),
            order => order,
        }
    })
    .strength
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_part1() {
        assert_eq!(31, part1("0/2\n2/2\n2/3\n3/4\n3/5\n0/1\n10/1\n9/10"))
    }

    #[test]
    fn test_part2() {
        assert_eq!(19, part2("0/2\n2/2\n2/3\n3/4\n3/5\n0/1\n10/1\n9/10"))
    }
}
