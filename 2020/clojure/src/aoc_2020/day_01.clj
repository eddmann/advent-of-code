(ns aoc-2020.day-01)

(defn- parse-report [input]
  (map clojure.edn/read-string (clojure.string/split input #"\n")))

(defn part-1
  "Day 01 Part 1"
  [input]
  (let [report (parse-report input)
        target 2020]
    (first
      (for [x report
            y report
            :when (and (not= x y) (= (+ x y) target))]
        (* x y)))))

(defn part-2
  "Day 01 Part 2"
  [input]
  (let [report (parse-report input)
        target 2020]
    (first
      (for [x report
            y report
            z report
            :when (and (not= x y z) (= (+ x y z) target))]
        (* x y z)))))
