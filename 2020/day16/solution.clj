(load-file "/src/helpers.clj")

(defn parse [filename]
  (let [[rules ticket nearby-tickets] (read-line-groups filename)]
    {:rules (map
              (fn [[_ name a1 a2 b1 b2]] {:name (clojure.string/trim name)
                                          :validate #(or (<= (Integer/parseInt a1 10) % (Integer/parseInt a2 10))
                                                         (<= (Integer/parseInt b1 10) % (Integer/parseInt b2 10)))})
              (re-seq #"([\w\s]+)\: (\d+)-(\d+) or (\d+)-(\d+)" rules))
    :your-ticket (->> (clojure.string/split ticket #"\n")
                      second
                      (#(clojure.string/split % #","))
                      (map read-string))
    :nearby-tickets (->> (clojure.string/split nearby-tickets #"\n")
                         rest
                         (map (fn [line] (map read-string (clojure.string/split line #",")))))}))

;--

(defn part1 [{:keys [rules nearby-tickets]}]
  (let [invalid-field-values #(filter (fn [val] (not-any? (fn [{:keys [validate]}] (validate val)) rules)) %)]
    (->> nearby-tickets
         (mapcat invalid-field-values)
         (reduce +))))

(println (part1 (parse "/src/day16/input.txt")))

; --

(defn valid-ticket? [rules ticket]
  (every? #(some (fn [{:keys [validate]}] (validate %)) rules) ticket))

(defn possible-column-rules [rules tickets]
  (letfn [(matching-rule-names [column]
            (->> rules
                 (filter (fn [{:keys [validate]}] (every? #(validate %) column)))
                 (map :name)
                 set))]
  (map-indexed (fn [idx column] [idx (matching-rule-names column)])
               (apply map vector tickets))))

(def sort-by-possible-rules-count
  #(sort (fn [[_ rules-a] [_ rules-b]] (compare (count rules-a) (count rules-b))) %))

(defn find-unseen-rule [rule-mapping possible-rules]
  (first (clojure.set/difference possible-rules (vals rule-mapping))))

(defn find-departure-values [ticket rule-mapping]
  (->> ticket
       (map-indexed (fn [idx val] (when (clojure.string/starts-with? (get rule-mapping idx) "departure") val)))
       (remove nil?)))

(defn part2 [{:keys [rules your-ticket nearby-tickets]}]
  (let [valid-nearby-tickets (filter (partial valid-ticket? rules) nearby-tickets)]
    (->> (possible-column-rules rules valid-nearby-tickets)
         (sort-by-possible-rules-count)
         (reduce (fn [rule-mapping [idx possible-rules]] (assoc rule-mapping idx (find-unseen-rule rule-mapping possible-rules))) {})
         ((partial find-departure-values your-ticket))
         (reduce *))))

(println (part2 (parse "/src/day16/input.txt")))
