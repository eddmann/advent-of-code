from itertools import combinations


class Number:
    def __init__(self, value, parent=None):
        self.parent = parent
        self.depth = (parent.depth + 1) if parent else 0

        match value:
            case [left, right]:
                self.is_pair = True
                self.left, self.right = Number(left, self), Number(right, self)
            case int():
                self.is_pair = False
                self.value = value
            case Number():
                self.is_pair = value.is_pair
                if self.is_pair:
                    self.left, self.right = Number(value.left, self), \
                        Number(value.right, self)
                else:
                    self.value = value.value

    def __add__(self, that):
        number = Number([self, that])
        reduced = True
        while reduced:
            reduced = number._explode() or number._split()
        return number

    def __radd__(self, that):
        return self.__add__(that)

    def __repr__(self):
        return "[{},{}]".format(self.left, self.right) \
            if self.is_pair else repr(self.value)

    def magnitude(self):
        return 3 * self.left.magnitude() + 2 * self.right.magnitude() \
            if self.is_pair else self.value

    def _explode(self):
        def find_explodable(number):
            if number.is_pair:
                if number.depth >= 4:
                    return number
                return find_explodable(number.left) or find_explodable(number.right)
            return None

        pair = find_explodable(self)
        if not pair:
            return False

        if left_number := pair._find_left_value():
            left_number.value += pair.left.value
        if right_number := pair._find_right_value():
            right_number.value += pair.right.value

        pair.is_pair = False
        pair.value = 0
        pair.left = pair.right = None

        return True

    def _split(self):
        def find_split(number):
            if number.is_pair:
                return find_split(number.left) or find_split(number.right)
            return number if number.value >= 10 else None

        s_num = find_split(self)
        if not s_num:
            return False

        s_num.is_pair = True
        s_num.left = Number(s_num.value // 2, s_num)
        s_num.right = Number(s_num.value - s_num.value // 2, s_num)
        s_num.value = None

        return True

    def _find_left_value(self):
        def find_parent(parent, value):
            if not parent:
                return None
            if parent.left == value:
                return find_parent(parent.parent, parent)
            return first_value(parent.left)

        def first_value(number):
            if number.is_pair:
                return first_value(number.right) or first_value(number.left)
            return number

        return find_parent(self.parent, self)

    def _find_right_value(self):
        def find_parent(parent, value):
            if not parent:
                return None
            if parent.right == value:
                return find_parent(parent.parent, parent)
            return first_value(parent.right)

        def first_value(number):
            if number.is_pair:
                return first_value(number.left) or first_value(number.right)
            return number

        return find_parent(self.parent, self)


def part1(input):
    numbers = map(Number, map(eval, input.splitlines()))
    return sum(numbers).magnitude()


def part2(input):
    numbers = map(Number, map(eval, input.splitlines()))
    return max((a + b).magnitude() for (a, b) in combinations(numbers, 2))
