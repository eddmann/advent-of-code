(ns aoc-2020.day-12-test
  (:require [clojure.test :refer [deftest testing is]]
            [aoc-2020.day-12 :refer [part-1 part-2]]))

(def navigation-instructions (clojure.string/trim "
F10
N3
F7
R90
F11
"))

(deftest calculate-locations-manhattan-distance
  (let [expected 25]
    (is (= expected (part-1 navigation-instructions)))))

(deftest calculate-locations-manhattan-distance-using-waypoint
  (let [expected 286]
    (is (= expected (part-2 navigation-instructions)))))
