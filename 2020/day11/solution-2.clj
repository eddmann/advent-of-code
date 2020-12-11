(load-file "/src/helpers.clj")

(defn parse-grid [filename]
  (mapv #(vec (char-array %)) (read-lines filename)))

(defn next-seat-occupied? [grid row col row-offset col-offset multipler]
  (case (get-in grid [(+ row (* row-offset multipler)) (+ col (* col-offset multipler))])
    \# true
    \. (recur grid row col row-offset col-offset (inc multipler))
    false))

(defn count-occupied-seats [grid row col check-next-seat?]
  (reduce
    (fn [acc [row-offset col-offset]]
      (let [seat (get-in grid [(+ row row-offset) (+ col col-offset)])]
        (cond
          (= seat \#) (inc acc)
          (and (= seat \.) check-next-seat? (next-seat-occupied? grid row col row-offset col-offset 2)) (inc acc)
          :else acc)))
    0
    (for [row-offset [-1 0 1] col-offset [-1 0 1] :when (not= [row-offset col-offset] [0 0])]
      [row-offset col-offset])))

(defn gen-next-grid [grid min-occupied-seats check-next-seat?]
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

(defn part1 [grid]
  (let [next-grid (gen-next-grid grid 3 false)]
    (if (= grid next-grid)
      (get (frequencies (flatten next-grid)) \#)
      (recur next-grid))))

(defn part2 [grid]
  (let [next-grid (gen-next-grid grid 4 true)]
    (if (= grid next-grid)
      (get (frequencies (flatten next-grid)) \#)
      (recur next-grid))))

(def grid (parse-grid "/src/day11/input.txt"))
(println (part1 grid))
(println (part2 grid))
