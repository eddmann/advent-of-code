(ns aoc-2020.day-06-test
  (:require [clojure.test :refer [deftest testing is]]
            [aoc-2020.day-06 :refer [part-1 part-2]]))

(def group-answers (clojure.string/trim "
abc

a
b
c

ab
ac

a
a
a
a

b
"))

(deftest count-any-answered-group-questions
  (let [expected 11]
    (is (= expected (part-1 group-answers)))))

(deftest count-all-answered-group-questions
  (let [expected 6]
    (is (= expected (part-2 group-answers)))))
