(ns aoc-2020.day-08
  (:require [clojure.string :as str]))

(defn- parse-program [input]
  (mapv (fn [line]
          (let [[op val] (str/split line #" ")]
            [(keyword op) (read-string val)]))
        (str/split-lines input)))

(defn- exec [instructions]
  (loop [acc 0 pos 0 seen #{}]
    (if-let [[op val] (get instructions pos)]
      (cond
        (contains? seen pos) [acc false]
        (= op :acc) (recur (+ acc val) (inc pos) (conj seen pos))
        (= op :jmp) (recur acc (+ pos val) (conj seen pos))
        :else (recur acc (inc pos) (conj seen pos)))
      [acc (= pos (count instructions))])))

(defn- find-complete-acc [instructions]
  (first
    (keep-indexed
      (fn [idx [op]]
        (when-let [new-op ({:jmp :nop :nop :jmp} op)]
          (let [[acc completed?] (exec (assoc-in instructions [idx 0] new-op))]
            (when completed? acc))))
      instructions)))

(defn part-1
  "Day 08 Part 1"
  [input]
  (first (exec (parse-program input))))

(defn part-2
  "Day 08 Part 2"
  [input]
  (find-complete-acc (parse-program input)))
