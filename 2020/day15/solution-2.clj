(load-file "/src/helpers.clj")

(defn rambunctious-recitation [numbers]
  (let [starting-numbers (butlast numbers)
        next-number (fn next [occurrences number turn]
                      (lazy-seq (cons number (next (assoc occurrences number turn)
                                                   (- turn (get occurrences number turn))
                                                   (inc turn)))))]
    (lazy-cat starting-numbers
              (next-number (into {} (map-indexed (fn [idx num] [num (inc idx)]) starting-numbers))
                           (last numbers)
                           (count numbers)))))

(def numbers (->> "19,0,5,1,10,13" (#(clojure.string/split % #",")) (map read-string)))


(println (take 7 (rambunctious-recitation numbers)))
(println (nth (rambunctious-recitation numbers) (dec 2020)))
(println (nth (rambunctious-recitation numbers) (dec 30000000)))
