class Elf:
    def __init__(self, number, next=None, previous=None):
        self.number = number
        self.next = next
        self.previous = previous


def build_circle(size):
    head = current = Elf(1)

    for number in range(2, size + 1):
        elf = Elf(number, previous=current)
        current.next = elf
        current = elf

    current.next = head
    head.previous = current

    return head


def leave_cirlce(elf):
    elf.previous.next = elf.next
    elf.next.previous = elf.previous


def part1(input):
    total = int(input)
    head = build_circle(total)

    current = head
    while current != current.next:
        current.next = current.next.next
        current = current.next

    return current.number


def part2(input):
    total = int(input)
    head = build_circle(total)

    opposite_elf = head
    for _ in range(total // 2):
        opposite_elf = opposite_elf.next

    current = head
    remaining = total
    while current != current.next:
        leave_cirlce(opposite_elf)
        remaining -= 1
        opposite_elf = opposite_elf.next.next if remaining % 2 == 0 else opposite_elf.next
        current = current.next

    return current.number
