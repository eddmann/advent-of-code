(ns aoc-2020.day-08-test
  (:require [clojure.test :refer [deftest testing is]]
            [aoc-2020.day-08 :refer [part-1 part-2]]))

(def program (clojure.string/trim "
nop +0
acc +1
jmp +4
acc +3
jmp -3
acc -99
acc +1
jmp -4
acc +6
"))

(deftest halt-on-repeated-instruction
  (let [expected 5]
    (is (= expected (part-1 program)))))

(deftest modify-program-for-successful-termination
  (let [expected 8]
    (is (= expected (part-2 program)))))
