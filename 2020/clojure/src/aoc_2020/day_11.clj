(ns aoc-2020.day-11)

(defn- parse-grid [input]
  (mapv #(vec (char-array %)) (clojure.string/split input #"\n")))

(def seat-directions
  (for [row-offset [-1 0 1]
        col-offset [-1 0 1]
        :when (not= [row-offset col-offset] [0 0])]
    [row-offset col-offset]))

(defn- count-occupied-seats [grid row col check-next-seat?]
  (reduce
    (fn [acc [row-offset col-offset]]
      (loop [curr-row (+ row row-offset)
             curr-col (+ col col-offset)]
        (let [seat (get-in grid [curr-row curr-col])]
          (cond
            (= seat \#) (inc acc)
            (and (= seat \.) check-next-seat?) (recur (+ curr-row row-offset) (+ curr-col col-offset))
            :else acc))))
    0
    seat-directions))

(defn- gen-next-grid [grid min-occupied-seats check-next-seat?]
  (reduce
    (fn [next-grid [row col]]
      (let [occupied-seats (count-occupied-seats grid row col check-next-seat?)
            seat (get-in grid [row col])]
        (cond
          (and (= seat \L) (zero? occupied-seats)) (assoc-in next-grid [row col] \#)
          (and (= seat \#) (> occupied-seats min-occupied-seats)) (assoc-in next-grid [row col] \L)
          :else next-grid)))
    grid
    (for [row (range 0 (count grid)) col (range 0 (count (first grid)))]
      [row col])))

(defn- part-1' [grid]
  (let [next-grid (gen-next-grid grid 3 false)]
    (if (= grid next-grid)
      (get (frequencies (flatten next-grid)) \#)
      (recur next-grid))))

(defn part-1
  "Day 11 Part 1"
  [input]
  (part-1' (parse-grid input)))

(defn- part-2' [grid]
  (let [next-grid (gen-next-grid grid 4 true)]
    (if (= grid next-grid)
      (get (frequencies (flatten next-grid)) \#)
      (recur next-grid))))

(defn part-2
  "Day 11 Part 2"
  [input]
  (part-2' (parse-grid input)))
