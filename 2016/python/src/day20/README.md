## \--- Day 20: Firewall Rules ---

You'd like to set up a small hidden computer here so you can use it to get back into the network later. However, the corporate firewall only allows communication with certain external [IP addresses](https://en.wikipedia.org/wiki/IPv4#Addressing).

You've retrieved the list of blocked IPs from the firewall, but the list seems to be messy and poorly maintained, and it's not clear which IPs are allowed. Also, rather than being written in [dot-decimal](https://en.wikipedia.org/wiki/Dot-decimal_notation) notation, they are written as plain [32-bit integers](https://en.wikipedia.org/wiki/32-bit), which can have any value from `0` through `4294967295`, inclusive.

For example, suppose only the values `0` through `9` were valid, and that you retrieved the following blacklist:

```
5-8
0-2
4-7
```

The blacklist specifies ranges of IPs (inclusive of both the start and end value) that are _not_ allowed. Then, the only IPs that this firewall allows are `3` and `9`, since those are the only numbers not in any range.

Given the list of blocked IPs you retrieved from the firewall (your puzzle input), _what is the lowest-valued IP_ that is not blocked?

Your puzzle answer was `32259706`.

## \--- Part Two ---

_How many IPs_ are allowed by the blacklist?

Your puzzle answer was `113`.

Both parts of this puzzle are complete! They provide two gold stars: \*\*

At this point, all that is left is for you to [admire your Advent calendar](/2016).

If you still want to see it, you can [get your puzzle input](20/input).
