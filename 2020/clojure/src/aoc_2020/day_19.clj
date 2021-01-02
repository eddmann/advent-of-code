(ns aoc-2020.day-19
  (:require [clojure.string :refer (split starts-with?)]))

(defn- parse-rules [rules]
  (letfn [(parse-rule [rule]
            (if (starts-with? rule "\"")
              (.charAt rule 1)
              (map #(split % #" ") (split rule #" \| "))))]
    (->> (split rules #"\n")
         (map #(split % #": "))
         (map (fn [[idx rule]] [idx (parse-rule rule)]))
         (into {}))))

(defn- parse-messages [messages]
  (map char-array (split messages #"\n")))

(defn- rule-match? [rules message [rule-idx & remaining-rule-idxs]]
  (if (nil? rule-idx)
    (empty? message)
    (let [rule (get rules rule-idx)]
      (if (seq? rule)
        (some (fn [or-rule] (rule-match? rules message (concat or-rule remaining-rule-idxs)))
              rule)
        (and (= (first message) rule)
             (rule-match? rules (rest message) remaining-rule-idxs))))))

(defn part-1
  "Day 19 Part 1"
  [input]
  (let [[raw-rules raw-messages] (split input #"\n\n")
        rules (parse-rules raw-rules)]
    (->> (parse-messages raw-messages)
         (filter (fn [message] (some #(rule-match? rules message %) (get rules "0"))))
         count)))

(defn part-2
  "Day 19 Part 2"
  [input]
  (let [[raw-rules raw-messages] (split input #"\n\n")
        rules (parse-rules (str raw-rules "\n8: 42 | 42 8\n11: 42 31 | 42 11 31"))]
    (->> (parse-messages raw-messages)
         (filter (fn [message] (some #(rule-match? rules message %) (get rules "0"))))
         count)))
