(ns aoc-2020.day-14)

(defn- parse-instructions [input]
  (->> (clojure.string/split input #"\n")
       (map
         (fn [line]
           (let [mask (second (re-matches #"mask = (.+)" line))
                 memory (rest (re-matches #"mem\[(\d+)\] = (\d+)" line))]
             (if mask
               {:op :mask :val (char-array mask)}
               {:op :memory
                :idx (Integer/parseInt (first memory) 10)
                :val (Integer/parseInt (second memory) 10)}))))))

(defn- apply-mask [mask val]
  (let [rmask (reverse mask)
        rval (take 36 (concat (reverse (Integer/toString val 2)) (repeat 36 \0)))]
    (->>
      (reduce
        (fn [result [m v]] (conj result (if (= m \X) v m)))
        []
        (map vector rmask rval))
      reverse
      (clojure.string/join "")
      (#(BigInteger. % 2)))))

(defn- get-floating-variants [[head & tail]]
  (if (nil? head)
    [""]
    (let [variant (get-floating-variants tail)]
      (if (= \X head)
        (concat (map #(cons \1 %) variant) (map #(cons \0 %) variant))
        (map #(cons head %) variant)))))

(defn- decode-memory-addresses [mask idx]
  (let [rmask (reverse mask)
        ridx (take 36 (concat (reverse (Integer/toString idx 2)) (repeat 36 \0)))]
    (->>
      (reduce
        (fn [result [m v]] (conj result (case m \X \X \1 \1 v)))
        []
        (map vector rmask ridx))
      reverse
      (get-floating-variants)
      (map #(BigInteger. (clojure.string/join "" %) 2)))))

(defn part-1
  "Day 14 Part 1"
  [input]
  (->> (parse-instructions input)
       (reduce
         (fn [machine {:keys [op val idx]}]
           (case op
             :mask (assoc machine :mask val)
             :memory (assoc-in machine [:memory idx] (apply-mask (:mask machine) val))))
         {:mask nil :memory {}})
       :memory
       (#(apply + (vals %)))))

(defn part-2
  "Day 14 Part 2"
  [input]
  (->> (parse-instructions input)
       (reduce
         (fn [machine {:keys [op val idx]}]
           (case op
             :mask (assoc machine :mask val)
             :memory (assoc machine :memory (reduce #(assoc %1 %2 val) (:memory machine) (decode-memory-addresses (:mask machine) idx)))))
         {:mask nil :memory {}})
       :memory
       (#(apply + (vals %)))))
