(ns aoc-2020.day-09)

(defn- parse-xmas-data [input]
  (let [[seq-size seq] (clojure.string/split input #"\n\n")]
    [(read-string seq-size) (mapv read-string (clojure.string/split seq #"\n"))]))

(defn- combinations [col]
  (for [x col y col] [x y]))

(defn- first-incorrect-sum [_ col]
  (let [sum (last col)
        seq (butlast col)]
    (when (not (some #(= sum (apply + %)) (combinations seq)))
      (reduced sum))))

(defn part-1
  "Day 09 Part 1"
  [input]
  (let [[seq-size seq] (parse-xmas-data input)]
    (->> seq (partition (inc seq-size) 1) (reduce first-incorrect-sum nil))))

(defn part-2
  "Day 09 Part 2"
  [input]
  (let [[_ seq] (parse-xmas-data input)
        sum (part-1 input)]
    (loop [start 0
           end 1
           acc (apply + (take 2 seq))]
      (cond
        (= end (count seq)) nil
        (> acc sum) (recur (inc start) end (- acc (nth seq start)))
        (< acc sum) (recur start (inc end) (+ acc (nth seq (inc end) 0)))
        :else (let [subseq (subvec seq start end)]
          (+ (apply min subseq) (apply max subseq)))))))
