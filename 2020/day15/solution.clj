(load-file "/src/helpers.clj")

(defn find-turn-number [input nth]
  (let [numbers (map read-string (clojure.string/split input #","))]
    (loop [turn (count numbers)
           number (last numbers)
           occurrences (transient (into {} (map-indexed (fn [idx num] [num (inc idx)]) (butlast numbers))))]
      (if (< turn nth)
        (recur (inc turn) (- turn (get occurrences number turn)) (assoc! occurrences number turn))
        number))))

(def input "19,0,5,1,10,13")
(println (find-turn-number input 2020))
(println (find-turn-number input 30000000))
