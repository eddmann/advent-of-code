(ns aoc-2020.day-07
  (:require [clojure.string :as str]))

(defn- parse-bag [line]
  (let [[_ colour raw-contents] (re-matches #"([a-z\s]+) bags contain (.+)" line)
        contents (->> (re-seq #"([0-9]+) ([a-z\s]+) bag" raw-contents)
                      (map (fn [[_ count colour]] [colour (read-string count)]))
                      (into {}))]
    [colour contents]))

(defn- parse-bag-rules [input]
  (into {} (map parse-bag (str/split-lines input))))

(defn- in-bag? [bags target current]
  (apply (some-fn #{target} #(in-bag? bags target %1))
         (keys (bags current))))

(defn- count-required-bags [bags colour]
  (let [root (bags colour)]
    (if (empty? root)
      0
      (reduce-kv #(+ %1 %3 (* %3 (count-required-bags bags %2))) 0 root))))

(defn part-1
  "Day 07 Part 1"
  [input]
  (let [bags (parse-bag-rules input)]
    (count (filter #(in-bag? bags "shiny gold" %1) (keys bags)))))

(defn part-2
  "Day 07 Part 2"
  [input]
  (count-required-bags (parse-bag-rules input) "shiny gold"))
