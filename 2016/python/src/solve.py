import sys
import importlib.util
import os
import datetime


def solve(part, input_content):
    start_time = datetime.datetime.now()
    answer = part(input_content)
    return answer, (datetime.datetime.now() - start_time).total_seconds() * 1000


def load_solution(file_path):
    spec = importlib.util.spec_from_file_location("solution", file_path)
    solution = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(solution)
    return solution


def read_input(file_path):
    with open(file_path, 'r') as file:
        return file.read()


def main(argv):
    day_no, solution_no = map(int, argv)

    day_dir = "{}/day{:02}".format(os.path.dirname(__file__), day_no)
    solution = load_solution("{}/solution-{}.py".format(day_dir, solution_no))
    input_content = read_input(day_dir + "/input.txt")

    print("Day {}, Solution {}".format(day_no, solution_no))

    if (hasattr(solution, 'part1')):
        answer, duration = solve(solution.part1, input_content)
        print("Part 1: {} [time taken: {:.3f} ms]".format(answer, duration))

    if (hasattr(solution, 'part2')):
        answer, duration = solve(solution.part2, input_content)
        print("Part 2: {} [time taken: {:.3f} ms]".format(answer, duration))


if __name__ == "__main__":
    main(sys.argv[1:])
