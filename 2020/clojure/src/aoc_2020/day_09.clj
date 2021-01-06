(ns aoc-2020.day-09
  (:require [clojure.string :as str]
            [clojure.math.combinatorics :refer (combinations)]))

(defn- parse-xmas-data [input]
  (let [[seq-size seq] (str/split input #"\n\n")]
    [(read-string seq-size) (mapv read-string (str/split-lines seq))]))

(defn- incorrect-sum [col]
  (let [sum (last col)
        seq (butlast col)]
    (when (not (some #(= sum (apply + %)) (combinations seq 2)))
      sum)))

(defn part-1
  "Day 09 Part 1"
  [input]
  (let [[seq-size seq] (parse-xmas-data input)]
    (some incorrect-sum (partition (inc seq-size) 1 seq))))

(defn part-2
  "Day 09 Part 2"
  [input]
  (let [[_ seq] (parse-xmas-data input)
        sum (part-1 input)]
    (loop [start 0
           end 1
           acc (apply + (take 2 seq))]
      (cond
        (= end (count seq)) nil
        (> acc sum) (recur (inc start) end (- acc (nth seq start)))
        (< acc sum) (recur start (inc end) (+ acc (nth seq (inc end) 0)))
        :else (let [sub-seq (subvec seq start end)]
          (+ (apply min sub-seq) (apply max sub-seq)))))))
