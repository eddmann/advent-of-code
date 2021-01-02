(ns aoc-2020.day-10-test
  (:require [clojure.test :refer [deftest testing is]]
            [aoc-2020.day-10 :refer [part-1 part-2]]))

(def adapters (clojure.string/trim "
28
33
18
42
31
14
46
20
48
47
24
23
49
45
19
38
39
11
1
32
25
35
8
17
7
9
4
2
34
10
3
"))

(deftest jolt-differences
  (let [expected 220]
    (is (= expected (part-1 adapters)))))

(deftest adapter-arrangements
  (let [expected 19208]
    (is (= expected (part-2 adapters)))))
