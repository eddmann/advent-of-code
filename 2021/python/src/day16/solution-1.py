def hex_to_bin(hex):
    return ''.join([bin(int(h, 16))[2:].zfill(4) for h in hex])


def apply_reduction(type, packets):
    from functools import reduce
    from operator import mul

    match type:
        case 0: return sum(packets)
        case 1: return reduce(mul, packets, 1)
        case 2: return min(packets)
        case 3: return max(packets)
        case 4: return int(''.join(packets), 2)
        case 5: return 1 if packets[0] > packets[1] else 0
        case 6: return 1 if packets[0] < packets[1] else 0
        case 7: return 1 if packets[0] == packets[1] else 0
        case _: raise Exception('Unknown type')


def evaluate_expression(bits, version_total=0):
    version = int(bits[:3], 2)
    type = int(bits[3:6], 2)

    if type == 4:
        pointer, packets = 6, []
        has_next_part = True

        while has_next_part:
            has_next_part = bits[pointer] == '1'
            packets.append(bits[pointer+1:pointer+5])
            pointer += 5

        return (version_total + version,
                apply_reduction(type, packets),
                pointer)

    BIT_MODE, BIT_START = 6, 7

    if bits[BIT_MODE] == '0':
        length = int(bits[BIT_START:BIT_START+15], 2)
        sub_bits = bits[BIT_START+15:BIT_START+15+length]
        pointer, packets = 0, []

        while pointer < length:
            version_total, result, sub_pointer = evaluate_expression(
                sub_bits[pointer:], version_total)
            packets.append(result)
            pointer += sub_pointer

        return (version_total + version,
                apply_reduction(type, packets),
                BIT_START+15+length)

    remaining_subpackets = int(bits[BIT_START:BIT_START+11], 2)
    sub_bits = bits[BIT_START+11:]
    pointer, packets = 0, []

    while remaining_subpackets:
        version_total, result, sub_pointer = evaluate_expression(
            sub_bits[pointer:], version_total)
        packets.append(result)
        pointer += sub_pointer
        remaining_subpackets -= 1

    return (version_total + version,
            apply_reduction(type, packets),
            BIT_START+11+pointer)


def part1(input):
    '''
    >>> part1('8A004A801A8002F478')
    16
    >>> part1('620080001611562C8802118E34')
    12
    >>> part1('C0015000016115A2E0802F182340')
    23
    >>> part1('A0016C880162017C3686B18A3D4780')
    31
    '''

    version_total, _, _ = evaluate_expression(hex_to_bin(input))
    return version_total


def part2(input):
    '''
    >>> part2('C200B40A82')
    3
    >>> part2('04005AC33890')
    54
    >>> part2('880086C3E88112')
    7
    >>> part2('CE00C43D881120')
    9
    >>> part2('D8005AC2A8F0')
    1
    >>> part2('F600BC2D8F')
    0
    >>> part2('9C005AC2F8F0')
    0
    >>> part2('9C0141080250320F1802104A08')
    1
    '''

    _, result, _ = evaluate_expression(hex_to_bin(input))
    return result
