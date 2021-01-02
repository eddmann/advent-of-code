(ns aoc-2020.day-02-test
  (:require [clojure.test :refer [deftest testing is]]
            [aoc-2020.day-02 :refer [part-1 part-2]]))

(def password-list (clojure.string/trim "
1-3 a: abcde
1-3 b: cdefg
2-9 c: ccccccccc
"))

(deftest count-valid-passwords-based-on-character-occurrence
  (let [expected 2]
    (is (= expected (part-1 password-list)))))

(deftest count-valid-passwords-based-on-character-position
  (let [expected 1]
    (is (= expected (part-2 password-list)))))
