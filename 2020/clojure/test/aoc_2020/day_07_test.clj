(ns aoc-2020.day-07-test
  (:require [clojure.test :refer [deftest testing is]]
            [aoc-2020.day-07 :refer [part-1 part-2]]))

(def bag-rules-1 (clojure.string/trim "
light red bags contain 1 bright white bag, 2 muted yellow bags.
dark orange bags contain 3 bright white bags, 4 muted yellow bags.
bright white bags contain 1 shiny gold bag.
muted yellow bags contain 2 shiny gold bags, 9 faded blue bags.
shiny gold bags contain 1 dark olive bag, 2 vibrant plum bags.
dark olive bags contain 3 faded blue bags, 4 dotted black bags.
vibrant plum bags contain 5 faded blue bags, 6 dotted black bags.
faded blue bags contain no other bags.
dotted black bags contain no other bags.
"))

(deftest total-bags-which-can-contain-shiny-gold-bag
  (let [expected 4]
    (is (= expected (part-1 bag-rules-1)))))

(def bag-rules-2 (clojure.string/trim "
shiny gold bags contain 2 dark red bags.
dark red bags contain 2 dark orange bags.
dark orange bags contain 2 dark yellow bags.
dark yellow bags contain 2 dark green bags.
dark green bags contain 2 dark blue bags.
dark blue bags contain 2 dark violet bags.
dark violet bags contain no other bags.
"))

(deftest total-bags-a-shiny-gold-bag-contains
  (let [expected 126]
    (is (= expected (part-2 bag-rules-2)))))
