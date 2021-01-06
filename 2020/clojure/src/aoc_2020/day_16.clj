(ns aoc-2020.day-16
  (:require [clojure.string :as str]))

(defn- parse-rule [rule]
  (let [[_ name & numbers] (re-matches #"([\w\s]+)\: (\d+)-(\d+) or (\d+)-(\d+)" rule)
        [a1 a2 b1 b2] (map read-string numbers)]
    [name #(or (<= a1 % a2) (<= b1 % b2))]))

(defn- parse-ticket [ticket]
  (mapv read-string (str/split ticket #",")))

(defn- parse-ticket-notes [input]
  (let [[rules [_ your-ticket] [_ & nearby-tickets]] (map str/split-lines (str/split input #"\n\n"))]
    {:rules (into {} (map parse-rule rules))
     :your-ticket (parse-ticket your-ticket)
     :nearby-tickets (map parse-ticket nearby-tickets)}))

(defn- possible-column-names [rules tickets]
  (map-indexed
    (fn [idx col] [idx (set (filter #(every? (get rules %) col) (keys rules)))])
    (apply map vector tickets)))

(defn- deduce-column-names [possible-names]
  (loop [pos-names possible-names
         names {}]
    (if-let [[idx name] (some (fn [[i n]] (when (= 1 (count n)) [i (first n)])) pos-names)]
      (recur (map (fn [[i n]] [i (disj n name)]) pos-names)
             (assoc names name idx))
      names)))

(defn part-1
  "Day 16 Part 1"
  [input]
  (let [{:keys [rules nearby-tickets]} (parse-ticket-notes input)]
    (->> nearby-tickets
         (mapcat #(remove (apply some-fn (vals rules)) %))
         (apply +))))

(defn part-2
  "Day 16 Part 2"
  [input]
  (let [{:keys [rules your-ticket nearby-tickets]} (parse-ticket-notes input)
        valid-nearby-tickets (filter #(every? (apply some-fn (vals rules)) %) nearby-tickets)]
    (->> (possible-column-names rules valid-nearby-tickets)
         deduce-column-names
         (keep (fn [[name idx]] (when (str/starts-with? name "departure") (nth your-ticket idx))))
         (apply *))))
