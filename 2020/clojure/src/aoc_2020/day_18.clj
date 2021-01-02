(ns aoc-2020.day-18)

(defn- parse-expressions [input]
  (clojure.string/split input #"\n"))

(defn- tokenize [expr]
  (let [to-chars #(clojure.string/split (clojure.string/replace % " " "") #"")
        is-digit? #(and % (re-find #"^\d+$" %))]
    (reverse
      (reduce
        (fn [[t & ts :as tokens] token]
          (if (and (is-digit? token) (is-digit? t))
            (cons (str t token) ts)
            (cons token tokens)))
        '()
        (to-chars expr)))))

(defn- shunting-yard [ops tokens]
  (flatten
    (reduce
      (fn [[rpn stack] token]
        (let [less-op? #(and (contains? ops %) (<= (ops token) (ops %)))
              not-open-paren? #(not= "(" %)]
          (cond
            (= token "(") [rpn (cons token stack)]
            (= token ")") [(vec (concat rpn (take-while not-open-paren? stack))) (rest (drop-while not-open-paren? stack))]
            (contains? ops token) [(vec (concat rpn (take-while less-op? stack))) (cons token (drop-while less-op? stack))]
            :else [(conj rpn token) stack])))
      [[] ()]
      tokens)))

(defn- rpn [tokens]
  (let [ops {"+" + "-" - "*" * "/" /}]
    (first
      (reduce
        (fn [stack token]
          (if (contains? ops token)
            (cons ((ops token) (second stack) (first stack)) (drop 2 stack))
            (cons (read-string token) stack)))
        []
        tokens))))

(defn- calc [ops expr]
  (->> (tokenize expr)
       ((partial shunting-yard ops))
       rpn))

(defn part-1
  "Day 18 Part 1"
  [input]
  (->> (parse-expressions input)
       (map (partial calc {"+" 1 "-" 1 "*" 1 "/" 1}))
       (reduce +)))

(defn part-2
  "Day 18 Part 2"
  [input]
  (->> (parse-expressions input)
       (map (partial calc {"+" 2 "-" 1 "*" 1 "/" 1}))
       (reduce +)))
