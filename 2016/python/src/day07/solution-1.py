import re


def parse_ips(input):
    def parse_ip(ip):
        supernets = re.split(r"\[[^\]]+\]", ip)
        hypernets = re.findall(r"\[([^\]]+)\]", ip)
        return supernets, hypernets
    return map(parse_ip, input.splitlines())


def has_tls_support(ip):
    supernets, hypernets = ip
    abba = r"(.)((?!\1).)\2\1"
    return any(re.search(abba, s) for s in supernets) and not any(re.search(abba, h) for h in hypernets)


def has_ssl_support(ip):
    supernets, hypernets = ip
    aba = iter(ab for s in supernets for ab in re.findall(
        r"(?=(.)((?!\1).)\1)", s))
    return any(b + a + b in h for a, b in aba for h in hypernets)


def part1(input):
    '''
    >>> part1("""abba[mnop]qrst
    ...          abcd[bddb]xyyx
    ...          aaaa[qwer]tyui
    ...          ioxxoj[asdfgh]zxcvbn""")
    2
    '''

    return sum(has_tls_support(ip) for ip in parse_ips(input))


def part2(input):
    '''
    >>> part2("""aba[bab]xyz
    ...          xyx[xyx]xyx
    ...          aaa[kek]eke
    ...          zazbz[bzb]cdb""")
    3
    '''

    return sum(has_ssl_support(ip) for ip in parse_ips(input))
