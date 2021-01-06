(ns aoc-2020.day-02
  (:require [clojure.string :as str]))

(defn- parse-password [line]
  (let [[_ num1 num2 [letter] password] (re-find #"^([0-9]+)-([0-9]+)\s([a-z]):\s([a-z]+)$" line)]
    [(read-string num1) (read-string num2) letter password]))

(defn- parse-password-list [input]
  (map parse-password (str/split-lines input)))

(defn- is-valid-freq? [[min max letter password]]
  (let [letter-freq (count (filter #{letter} password))]
    (<= min letter-freq max)))

(defn- is-valid-pos? [[pos1 pos2 letter password]]
  (let [x (nth password (dec pos1))
        y (nth password (dec pos2))]
    (not= (= x letter) (= y letter))))

(defn part-1
  "Day 02 Part 1"
  [input]
  (count (filter is-valid-freq? (parse-password-list input))))

(defn part-2
  "Day 02 Part 2"
  [input]
  (count (filter is-valid-pos? (parse-password-list input))))
