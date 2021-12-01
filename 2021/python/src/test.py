import os
import importlib.util
import doctest
import unittest
import pathlib


def load_solution(path):
    spec = importlib.util.spec_from_file_location(
        '{}-{}'.format(path.parent.name, path.name), path.absolute())
    solution = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(solution)
    return solution


test_suite = unittest.TestSuite()

for path in pathlib.Path(os.path.dirname(__file__)).glob('day*/solution-*.py'):
    solution = load_solution(path)
    test_suite.addTests(doctest.DocTestSuite(solution))

unittest.TextTestRunner(verbosity=3).run(test_suite)
