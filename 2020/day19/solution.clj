(use '[clojure.string :only (split starts-with?)])

(load-file "/src/helpers.clj")

(defn parse-rules [rules]
  (letfn [(parse-rule [rule]
            (if (starts-with? rule "\"")
              (.charAt rule 1)
              (map #(split % #" ") (split rule #" \| "))))]
    (->> (split rules #"\n")
         (map #(split % #": "))
         (map (fn [[idx rule]] [idx (parse-rule rule)]))
         (into {}))))

(defn parse-messages [messages]
  (map char-array (split messages #"\n")))

(defn rule-match? [rules message [rule-idx & remaining-rule-idxs]]
  (if (nil? rule-idx)
    (empty? message)
    (let [rule (get rules rule-idx)]
      (if (seq? rule)
        (some (fn [or-rule] (rule-match? rules message (concat or-rule remaining-rule-idxs)))
              rule)
        (and (= (first message) rule)
             (rule-match? rules (rest message) remaining-rule-idxs))))))

(defn part1 [filename]
  (let [[raw-rules raw-messages] (read-line-groups filename)
        rules (parse-rules raw-rules)]
    (->> (parse-messages raw-messages)
         (filter (fn [message] (some #(rule-match? rules message %) (get rules "0"))))
         count)))

(defn part2 [filename]
  (let [[raw-rules raw-messages] (read-line-groups filename)
        rules (parse-rules (str raw-rules "\n8: 42 | 42 8\n11: 42 31 | 42 11 31"))]
    (->> (parse-messages raw-messages)
         (filter (fn [message] (some #(rule-match? rules message %) (get rules "0"))))
         count)))

(println (part1 "/src/day19/input.txt"))
(println (part2 "/src/day19/input.txt"))
