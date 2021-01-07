(ns aoc-2020.day-21-test
  (:require [clojure.test :refer [deftest testing is]]
            [aoc-2020.day-21 :refer [part-1 part-2]]))

(def foods (clojure.string/trim "
mxmxvkd kfcds sqjhc nhms (contains dairy, fish)
trh fvjkl sbzzf mxmxvkd (contains dairy)
sqjhc fvjkl (contains soy)
sqjhc mxmxvkd sbzzf (contains fish)
"))

(deftest occurrences-of-ingredients-without-allergens
  (let [expected 5]
    (is (= expected (part-1 foods)))))

(deftest canonical-dangerous-ingredient-list
  (let [expected "mxmxvkd,sqjhc,fvjkl"]
    (is (= expected (part-2 foods)))))
