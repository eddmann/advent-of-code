(use '[clojure.string :only (split)])

(load-file "/src/helpers.clj")

(defn parse-part1 [filename]
  (let [[timestamp bus-ids] (read-lines filename)]
    {:timestamp (Integer/parseInt timestamp 10)
     :bus-ids (->> (split bus-ids #",")
                   (filter #(not= % "x"))
                   (map #(Integer/parseInt % 10)))}))

(defn part1 [filename]
  (let [{:keys [timestamp bus-ids]} (parse-part1 filename)]
    (->> bus-ids
         (map (fn [bus-id]
           {:bus-id bus-id
            :diff (- (* (int (Math/ceil (/ timestamp bus-id))) bus-id) timestamp)}))
         (sort-by :diff)
         first
         (#(* (:bus-id %) (:diff %))))))

(defn parse-part2 [filename]
  (let [[_ bus-ids] (read-lines filename)]
    (->> (split bus-ids #",")
         (map-indexed #(if (= %2 "x") nil {:bus-id (Integer/parseInt %2 10) :delay %1}))
         (remove nil?))))

(defn part2 [filename]
  (let [[first-bus & buses] (parse-part2 filename)]
    (->> (reduce
            (fn [{:keys [multiplier timestamp]} {:keys [bus-id delay]}]
              (loop [ts timestamp]
                (if (zero? (mod (+ ts delay) bus-id))
                  {:multiplier (* multiplier bus-id) :timestamp ts}
                  (recur (+ ts multiplier)))))
            {:multiplier (:bus-id first-bus) :timestamp 0}
            buses)
          :timestamp)))

(println (part1 "/src/day13/input.txt"))
(println (part2 "/src/day13/input.txt"))
