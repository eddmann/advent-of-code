(ns aoc-2020.day-08
  (:require [clojure.string :refer (split)]))

(defn- parse-program [input]
  (mapv (fn [line]
          (let [[op val] (split line #" ")]
            [(keyword op) (Integer/parseInt val)]))
        (split input #"\n")))

(defn- exec [ops]
  (loop [acc 0 pos 0 seen #{}]
    (if-let [[op val] (nth ops pos nil)]
      (cond
        (some #{pos} seen) [acc false]
        (= op :acc) (recur (+ acc val) (inc pos) (conj seen pos))
        (= op :jmp) (recur acc (+ pos val) (conj seen pos))
        :else (recur acc (inc pos) (conj seen pos)))
      [acc (= pos (count ops))])))

(defn- find-complete-exec [ops]
  (letfn [(replace-op [pos op] (update ops pos (fn [[_ val]] [op val])))
          (is-complete? [[_ complete]] complete)]
    (loop [pos 0]
      (if-let [[op val] (nth ops pos nil)]
        (cond
          (and (= op :jmp) (is-complete? (exec (replace-op pos :nop)))) (exec (replace-op pos :nop))
          (and (= op :nop) (is-complete? (exec (replace-op pos :jmp)))) (exec (replace-op pos :jmp))
          :else (recur (inc pos)))))))

(defn part-1
  "Day 08 Part 1"
  [input]
  (->> (parse-program input)
       exec
       first))

(defn part-2
  "Day 08 Part 2"
  [input]
  (->> (parse-program input)
       find-complete-exec
       first))
