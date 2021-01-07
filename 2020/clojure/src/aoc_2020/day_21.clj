(ns aoc-2020.day-21
  (:require [clojure.string :as str]
            [clojure.set :as set]))

(defn- parse-foods [input]
  (map
    (fn [food]
      (let [[_ ingredients allergens] (re-matches #"(.+) \(contains (.+)\)" food)]
        [(set (str/split ingredients #" ")) (set (str/split allergens #", "))]))
    (str/split-lines input)))

(defn- build-allergen-ingredients-map [foods]
  (let [allergen-ingredients (map (fn [[ingredients allergens]]
                               (zipmap allergens (repeat ingredients))) foods)]
    (apply merge-with set/intersection allergen-ingredients)))

(defn- deduce-allergen-ingredient [possible-ingredients]
  (loop [pos-ingredients possible-ingredients
         ingredients {}]
    (if-let [[allergen ingredient] (some (fn [[a i]] (when (= 1 (count i)) [a (first i)])) pos-ingredients)]
      (recur (map (fn [[a i]] [a (disj i ingredient)]) pos-ingredients)
             (assoc ingredients allergen ingredient))
      ingredients)))

(defn part-1
  "Day 21 Part 1"
  [input]
  (let [foods (parse-foods input)
        all-ingredients (mapcat first foods)
        bad-ingredients (apply set/union (vals (build-allergen-ingredients-map foods)))]
    (count (remove bad-ingredients all-ingredients))))

(defn part-2
  "Day 21 Part 2"
  [input]
  (->> (parse-foods input)
       build-allergen-ingredients-map
       deduce-allergen-ingredient
       (sort-by first)
       (map second)
       (str/join ",")))
