(ns aoc-2020.day-19
  (:require [clojure.string :as str]))

(defn parse-rule [rule]
  (let [[idx condition] (str/split rule #": ")]
    [idx
     (if (str/starts-with? condition "\"")
       (nth condition 1)
       (map #(str/split % #" ") (str/split condition #" \| ")))]))

(defn parse [input]
  (let [[rules messages] (map str/split-lines (str/split input #"\n\n"))]
    {:rules (into {} (map parse-rule rules))
     :messages messages}))

(defn match? [rule-map message [rule & remaining-rules]]
  (if (or (nil? rule) (empty? message))
    (and (nil? rule) (empty? message))
    (let [condition (get rule-map rule)]
      (if (seq? condition)
        (some (fn [sub-condition] (match? rule-map message (concat sub-condition remaining-rules))) condition)
        (and (= (first message) condition) (match? rule-map (rest message) remaining-rules))))))

(defn part-1
  "Day 19 Part 1"
  [input]
  (let [{:keys [rules messages]} (parse input)]
    (count (filter #(match? rules % ["0"]) messages))))

(defn part-2
  "Day 19 Part 2"
  [input]
  (let [{:keys [rules messages]} (parse input)
        updated-rules (assoc rules "8" '(["42"] ["42" "8"])
                                   "11" '(["42" "31"] ["42" "11" "31"]))]
    (count (filter #(match? updated-rules % ["0"]) messages))))
