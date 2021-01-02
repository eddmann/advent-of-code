(ns aoc-2020.day-07)

(defn- parse-bag [line]
  (let [[_ colour raw-contents] (re-matches #"([a-z\s]+) bags contain (.+)" line)
        contents (->> (re-seq #"([0-9]+) ([a-z\s]+) bag" raw-contents)
                      (map (fn [[_ count colour]] [colour (Integer/parseInt count)]))
                      (into {}))]
    [colour contents]))

(defn- parse-bag-rules [input]
  (into {} (map parse-bag (clojure.string/split input #"\n"))))

(defn- in-bag? [bags colour curr-colour]
  (let [curr-bag (keys (bags curr-colour))]
    (or (some #(= %1 colour) curr-bag)
        (some true? (map #(in-bag? bags colour %1) curr-bag)))))

(defn- count-required-bags [bags colour]
  (let [root (bags colour)]
    (if (empty? root)
      0
      (reduce-kv #(+ %1 %3 (* %3 (count-required-bags bags %2))) 0 root))))

(defn part-1
  "Day 07 Part 1"
  [input]
  (let [bags (parse-bag-rules input)
        colour "shiny gold"]
    (reduce
      #(if (in-bag? bags colour %2) (inc %1) %1)
      0
      (keys bags))))

(defn part-2
  "Day 07 Part 2"
  [input]
  (count-required-bags (parse-bag-rules input) "shiny gold"))
