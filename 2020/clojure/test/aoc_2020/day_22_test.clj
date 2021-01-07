(ns aoc-2020.day-22-test
  (:require [clojure.test :refer [deftest testing is]]
            [aoc-2020.day-22 :refer [part-1 part-2]]))

(def player-decks (clojure.string/trim "
Player 1:
9
2
6
3
1

Player 2:
5
8
4
7
10
"))

(deftest winning-player-score
  (let [expected 306]
    (is (= expected (part-1 player-decks)))))

(deftest recursive-winning-player-score
  (let [expected 291]
    (is (= expected (part-2 player-decks)))))
