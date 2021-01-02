(ns aoc-2020.day-10)

(defn- parse-adapters [input]
  (sort (map read-string (clojure.string/split input #"\n"))))

(def total-adapter-arrangements
  (memoize
    (fn [xs total]
      (if (empty? xs)
        1
        (reduce
          (fn [acc x] (+ acc (total-adapter-arrangements (filter #(> % x) xs) x)))
          0
          (take-while #(< (- % total) 4) xs))))))

(defn part-1
  "Day 10 Part 1"
  [input]
  (->> (parse-adapters input)
       (reduce
         (fn [{:keys [acc y]} x] {:acc (update acc (- x y) inc) :y x})
         {:acc {1 0 3 1} :y 0})
       (#(apply * (vals (:acc %))))))

(defn part-2
  "Day 10 Part 2"
  [input]
  (total-adapter-arrangements (parse-adapters input) 0))
