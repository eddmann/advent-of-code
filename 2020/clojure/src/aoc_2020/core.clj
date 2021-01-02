(ns aoc-2020.core
  (:require [aoc-2020.day-01]
            [aoc-2020.day-02]
            [aoc-2020.day-03]
            [aoc-2020.day-04]
            [aoc-2020.day-05]
            [aoc-2020.day-06]
            [aoc-2020.day-07]
            [aoc-2020.day-08]
            [aoc-2020.day-09]
            [aoc-2020.day-10]
            [aoc-2020.day-11]
            [aoc-2020.day-12]
            [aoc-2020.day-13]
            [aoc-2020.day-14]
            [aoc-2020.day-15]
            [aoc-2020.day-16]
            [aoc-2020.day-17]
            [aoc-2020.day-18]
            [aoc-2020.day-19]
            [aoc-2020.day-20]
            [aoc-2020.day-21]
            [aoc-2020.day-22]
            [aoc-2020.day-23]
            [aoc-2020.day-24]
            [aoc-2020.day-25]))

(defn read-input
  [day]
  (slurp (clojure.java.io/resource day)))

(defn -main
  "Used to dispatch tasks from the command line.

  lein run d1.p1"
  [part]
  (case part
    "d1.p1" (println (aoc-2020.day-01/part-1 (read-input "day-01.txt")))
    "d1.p2" (println (aoc-2020.day-01/part-2 (read-input "day-01.txt")))
    "d2.p1" (println (aoc-2020.day-02/part-1 (read-input "day-02.txt")))
    "d2.p2" (println (aoc-2020.day-02/part-2 (read-input "day-02.txt")))
    "d3.p1" (println (aoc-2020.day-03/part-1 (read-input "day-03.txt")))
    "d3.p2" (println (aoc-2020.day-03/part-2 (read-input "day-03.txt")))
    "d4.p1" (println (aoc-2020.day-04/part-1 (read-input "day-04.txt")))
    "d4.p2" (println (aoc-2020.day-04/part-2 (read-input "day-04.txt")))
    "d5.p1" (println (aoc-2020.day-05/part-1 (read-input "day-05.txt")))
    "d5.p2" (println (aoc-2020.day-05/part-2 (read-input "day-05.txt")))
    "d6.p1" (println (aoc-2020.day-06/part-1 (read-input "day-06.txt")))
    "d6.p2" (println (aoc-2020.day-06/part-2 (read-input "day-06.txt")))
    "d7.p1" (println (aoc-2020.day-07/part-1 (read-input "day-07.txt")))
    "d7.p2" (println (aoc-2020.day-07/part-2 (read-input "day-07.txt")))
    "d8.p1" (println (aoc-2020.day-08/part-1 (read-input "day-08.txt")))
    "d8.p2" (println (aoc-2020.day-08/part-2 (read-input "day-08.txt")))
    "d9.p1" (println (aoc-2020.day-09/part-1 (read-input "day-09.txt")))
    "d9.p2" (println (aoc-2020.day-09/part-2 (read-input "day-09.txt")))
    "d10.p1" (println (aoc-2020.day-10/part-1 (read-input "day-10.txt")))
    "d10.p2" (println (aoc-2020.day-10/part-2 (read-input "day-10.txt")))
    "d11.p1" (println (aoc-2020.day-11/part-1 (read-input "day-11.txt")))
    "d11.p2" (println (aoc-2020.day-11/part-2 (read-input "day-11.txt")))
    "d12.p1" (println (aoc-2020.day-12/part-1 (read-input "day-12.txt")))
    "d12.p2" (println (aoc-2020.day-12/part-2 (read-input "day-12.txt")))
    "d13.p1" (println (aoc-2020.day-13/part-1 (read-input "day-13.txt")))
    "d13.p2" (println (aoc-2020.day-13/part-2 (read-input "day-13.txt")))
    "d14.p1" (println (aoc-2020.day-14/part-1 (read-input "day-14.txt")))
    "d14.p2" (println (aoc-2020.day-14/part-2 (read-input "day-14.txt")))
    "d15.p1" (println (aoc-2020.day-15/part-1 (read-input "day-15.txt")))
    "d15.p2" (println (aoc-2020.day-15/part-2 (read-input "day-15.txt")))
    "d16.p1" (println (aoc-2020.day-16/part-1 (read-input "day-16.txt")))
    "d16.p2" (println (aoc-2020.day-16/part-2 (read-input "day-16.txt")))
    "d17.p1" (println (aoc-2020.day-17/part-1 (read-input "day-17.txt")))
    "d17.p2" (println (aoc-2020.day-17/part-2 (read-input "day-17.txt")))
    "d18.p1" (println (aoc-2020.day-18/part-1 (read-input "day-18.txt")))
    "d18.p2" (println (aoc-2020.day-18/part-2 (read-input "day-18.txt")))
    "d19.p1" (println (aoc-2020.day-19/part-1 (read-input "day-19.txt")))
    "d19.p2" (println (aoc-2020.day-19/part-2 (read-input "day-19.txt")))
    "d20.p1" (println (aoc-2020.day-20/part-1 (read-input "day-20.txt")))
    "d20.p2" (println (aoc-2020.day-20/part-2 (read-input "day-20.txt")))
    "d21.p1" (println (aoc-2020.day-21/part-1 (read-input "day-21.txt")))
    "d21.p2" (println (aoc-2020.day-21/part-2 (read-input "day-21.txt")))
    "d22.p1" (println (aoc-2020.day-22/part-1 (read-input "day-22.txt")))
    "d22.p2" (println (aoc-2020.day-22/part-2 (read-input "day-22.txt")))
    "d23.p1" (println (aoc-2020.day-23/part-1 (read-input "day-23.txt")))
    "d23.p2" (println (aoc-2020.day-23/part-2 (read-input "day-23.txt")))
    "d24.p1" (println (aoc-2020.day-24/part-1 (read-input "day-24.txt")))
    "d24.p2" (println (aoc-2020.day-24/part-2 (read-input "day-24.txt")))
    "d25.p1" (println (aoc-2020.day-25/part-1 (read-input "day-25.txt")))
    "d25.p2" (println (aoc-2020.day-25/part-2 (read-input "day-25.txt")))
    (println "not found")))
