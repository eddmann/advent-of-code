# santa-lang Idiomatic Best Practices

## Core Idioms

### 1. Pipeline-First Style (`|>`)

Chain operations left-to-right instead of nesting function calls.

```santa
parse(input) |> filter(...) |> map(...) |> sum
```

**Why**: Reads naturally as a data transformation flow. Avoids deeply nested function calls.

### 2. Function Composition (`>>`) for Parsers

Compose reusable parsing chains.

```santa
let parse_inventories = split("\n\n") >> map(ints >> sum);
let parse_instructions = split("\n\n") >> second >> lines >> map(ints);
```

**Why**: Creates reusable parser combinators. Clean separation of concerns.

### 3. Underscore Partial Application

Concise lambdas for simple operations using `_` placeholder.

```santa
_ + 1       // instead of |x| x + 1
_ * 2       // instead of |x| x * 2
_ > 5       // predicates
_ != [y, x] // comparisons
```

**Why**: Avoids verbose lambda syntax for simple unary operations.

### 4. Predicate Naming Convention

Functions returning booleans end with `?`.

```santa
let is_marker? = |seq| size(seq) == size(set(seq));
let contains_human? = |expr| ...;

// Built-ins follow same convention
includes?([1, 2, 3], 2)
any?(_ > 0, [1, 2])
all?(_ > 0, [1, 2])
```

**Why**: Instantly signals boolean-returning functions.

### 5. Pattern Matching for Case Analysis

Use `match` for type-based dispatch and destructuring.

```santa
match [type(l), type(r)] {
  ["List", "Integer"] { compare(l, [r]) }
  ["Integer", "List"] { compare([l], r) }
  ["Integer", "Integer"] { l `cmp` r }
}

// With guards
match lhs {
  [x, "+", y] if contains_human?(x) { yell(x, [rhs, "-", y]) }
  [x, "+", y] if contains_human?(y) { yell(y, [rhs, "-", x]) }
  _ { evaluate(rhs) }
}
```

**Why**: Elegant handling of complex data structures. Guards add conditional logic.

### 6. Lazy Evaluation with Unbounded Ranges

Use unbounded ranges with `find` for "first that satisfies" problems.

```santa
4.. |> find(|pos| is_valid?(pos));

// Infinite iteration with iterate()
parse_state(input)
  |> iterate(step_fn)
  |> get(20)
```

**Why**: Avoids materializing full sequences. Natural for search problems.

### 7. Set Operations for Uniqueness/Intersection

Use sets for duplicate detection and finding common elements.

```santa
let common_item = intersection >> list >> first;

// Check uniqueness
size(sequence) == size(set(sequence))

// Find common across groups
groups |> map(set) |> chunk(3) |> map(intersection)
```

**Why**: Set operations naturally express "find duplicates" and "find common elements".

### 8. Fold for Stateful Iteration

Use `fold` for immutable state accumulation.

```santa
items |> fold(initial_state) |acc, item| {
  acc |> update(...) |> assoc(...)
}

// Nested folds for complex state
0..size(items) |> fold(state) |state, i| {
  items[i] |> fold(state) |state, item| { ... }
}
```

**Why**: Immutable updates to collections. Clean accumulation logic.

### 9. Higher-Order Functions for Behavior Parameterization

Pass behavior as function parameters to avoid duplication.

```santa
let solve = |pickup_fn, input| {
  // shared logic
  items |> pickup_fn |> process
};

part_one: input |> solve(reverse)
part_two: input |> solve(id)
```

**Why**: Abstracts over algorithm differences. Single source of truth for common logic.

### 10. Dictionary Operations for State Management

Use dictionaries for O(1) lookups and named state.

```santa
// Grid as dictionary
let parse_grid = |input| {
  zip(0.., lines(input))
    |> flat_map(|[y, row]| {
      zip(0.., row) |> map(|[x, val]| [[y, x], val]);
    })
    |> dict;
};

// Named state
#{items, op, divisor, throw_to, "activity": 0}
```

**Why**: Cleaner than nested arrays. Named access is self-documenting.

### 11. Trailing Lambda Syntax

Use trailing lambdas for readability with complex operations.

```santa
[1, 2, 3] |> map |x| {
  x * x
}

[1, 2, 3] |> fold(0) |acc, x| {
  acc + x
}
```

**Why**: Reads like language syntax rather than function calls.

## File Structure Convention

```santa
input: read("aoc://YYYY/N")

// Parsing helpers
let parse_items = lines >> map(ints);
let parse_grid = ...;

// Domain logic helpers
let process = |items| ...;
let is_valid? = |item| ...;

// Solutions
part_one: {
  input |> parse_items |> process |> sum
}

part_two: {
  input |> parse_items |> different_process |> sum
}

// Test cases
test: {
  input: "example input here"
  part_one: 123
  part_two: 456
}
```

## Style Guidelines

### Immutability First

Use persistent collection operations instead of mutation.

```santa
// Prefer
state |> assoc(key, value) |> update(other_key, _ + 1)

// Over
let mut state = ...;
state[key] = value;
```

### Functional Over Imperative

Use `map`/`filter`/`fold` instead of loops.

```santa
// Prefer
items |> filter(_ > 0) |> map(_ * 2) |> sum

// Over manual iteration
```

### Descriptive Naming

- `parse_*` for parsing functions
- `*?` for predicates
- Domain-specific names for logic (e.g., `rearrangement_procedure`, `monkey_business`)

### Formatting

- One pipeline operation per line for readability
- Multi-line lambda blocks for complex logic
- Blank lines between logical sections

```santa
parse_monkeys(input)
  |> iterate(round(_ / 3))
  |> get(20)
  |> map(_["activity"])
  |> sort(>)
  |> take(2)
  |> product;
```

## Common Parsing Patterns

### Lines to integers

```santa
lines >> map(int)
```

### Split and convert

```santa
split("\n\n") >> map(ints >> sum)
```

### Regex extraction

```santa
input |> regex_match("items: (.+)") |> map(split(",") >> map(int))
```

### Grid parsing

```santa
zip(0.., lines(input)) |> flat_map(|[y, row]| zip(0.., row) |> map(|[x, v]| [[y, x], v])) |> dict
```

### Destructuring assignment

```santa
let [a, b, c] = [1, 2, 3];
let [first, ..rest] = items;
let [items] = parsed;  // unwrap single-element list
```
