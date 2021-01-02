(ns aoc-2020.day-13)

(defn- parse-part1 [input]
  (let [[timestamp bus-ids] (clojure.string/split input #"\n")]
    {:timestamp (Integer/parseInt timestamp 10)
     :bus-ids (->> (clojure.string/split bus-ids #",")
                   (filter #(not= % "x"))
                   (map #(Integer/parseInt % 10)))}))

(defn- parse-part2 [input]
  (let [[_ bus-ids] (clojure.string/split input #"\n")]
    (->> (clojure.string/split bus-ids #",")
         (map-indexed #(if (= %2 "x") nil {:bus-id (Integer/parseInt %2 10) :delay %1}))
         (remove nil?))))

(defn part-1
  "Day 13 Part 1"
  [input]
  (let [{:keys [timestamp bus-ids]} (parse-part1 input)]
    (->> bus-ids
         (map (fn [bus-id]
           {:bus-id bus-id
            :diff (- (* (int (Math/ceil (/ timestamp bus-id))) bus-id) timestamp)}))
         (sort-by :diff)
         first
         (#(* (:bus-id %) (:diff %))))))

(defn part-2
  "Day 13 Part 2"
  [input]
  (let [[first-bus & buses] (parse-part2 input)]
    (->> (reduce
            (fn [{:keys [multiplier timestamp]} {:keys [bus-id delay]}]
              (loop [ts timestamp]
                (if (zero? (mod (+ ts delay) bus-id))
                  {:multiplier (* multiplier bus-id) :timestamp ts}
                  (recur (+ ts multiplier)))))
            {:multiplier (:bus-id first-bus) :timestamp 0}
            buses)
          :timestamp)))
