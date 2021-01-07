(ns aoc-2020.day-22
  (:require [clojure.string :as str]))

(defn- parse-player-decks [input]
  (->> (str/split input #"\n\n")
       (map str/split-lines)
       (map #(->> % rest (mapv read-string)))))

(defn- combat [p1 p2]
  (if (and (seq p1) (seq p2))
    (let [c1 (first p1) r1 (subvec p1 1)
          c2 (first p2) r2 (subvec p2 1)]
      (if (> c1 c2)
        (recur (conj r1 c1 c2) r2)
        (recur r1 (conj r2 c2 c1))))
    (or (seq p1) (seq p2))))

(defn- rec-combat [p1 p2]
  (letfn [(combat [p1 p2 history]
            (cond
              (empty? p1) [:p2 p2]
              (empty? p2) [:p1 p1]
              (history [p1 p2]) [:p1 p1]
              :else
                (let [c1 (first p1) r1 (subvec p1 1)
                      c2 (first p2) r2 (subvec p2 1)
                      [winner] (if (and (>= (count r1) c1) (>= (count r2) c2))
                                 (combat (subvec r1 0 c1) (subvec r2 0 c2) #{})
                                 [(if (> c1 c2) :p1 :p2)])]
                  (if (= winner :p1)
                    (recur (conj r1 c1 c2) r2 (conj history [p1 p2]))
                    (recur r1 (conj r2 c2 c1) (conj history [p1 p2]))))))]
    (second (combat p1 p2 #{}))))

(defn- calc-score [deck]
  (->> (reverse deck)
       (map-indexed #(* %2 (inc %1)))
       (apply +)))

(defn part-1
  "Day 22 Part 1"
  [input]
  (let [[p1 p2] (parse-player-decks input)]
    (calc-score (combat p1 p2))))

(defn part-2
  "Day 22 Part 2"
  [input]
  (let [[p1 p2] (parse-player-decks input)]
    (calc-score (rec-combat p1 p2))))
