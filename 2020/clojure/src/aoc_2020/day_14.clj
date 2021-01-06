(ns aoc-2020.day-14
  (:require [clojure.string :as str]))

(defn- parse-program [input]
  (map
    (fn [line]
      (let [[_ mask] (re-matches #"mask = (.+)" line)
            [_ address value] (re-matches #"mem\[(\d+)\] = (\d+)" line)]
        (if mask
          {:op :mask :value (char-array mask)}
          {:op :memory :address (read-string address) :value (read-string value)})))
    (str/split-lines input)))

(defn- pad-zero [s n]
  (apply str (take-last n (concat (repeat n \0) s))))

(defn- bin->bigint [b]
  (BigInteger. b 2))

(defn- apply-mask [decimal mask]
  (let [binary (pad-zero (Integer/toBinaryString decimal) 36)
        masked (apply str (map-indexed #(if (= %2 \X) (nth binary %1) %2) mask))]
    (bin->bigint masked)))

(defn- get-floating-variants [[bit & bits]]
  (if (nil? bit)
    [""]
    (let [variant (get-floating-variants bits)]
      (if (= \X bit)
        (concat (map #(apply str \1 %) variant) (map #(apply str \0 %) variant))
        (map #(apply str bit %) variant)))))

(defn- decode-memory-addresses [address mask]
  (let [binary (pad-zero (Integer/toBinaryString address) 36)
        masked (apply str (map-indexed #(if (= %2 \0) (nth binary %1) %2) mask))]
    (map bin->bigint (get-floating-variants masked))))

(defn exec [mem-update-fn program]
  (reduce
    (fn [state instruction]
      (case (:op instruction)
        :mask (assoc state :mask (:value instruction))
        :memory (assoc state :memory (mem-update-fn state (:address instruction) (:value instruction)))
        state))
    {:mask "000000000000000000000000000000000000" :memory {}}
    program))

(defn part-1
  "Day 14 Part 1"
  [input]
  (->> (parse-program input)
       (exec
         (fn [{:keys [mask memory]} address value]
           (assoc memory address (apply-mask value mask))))
       :memory
       vals
       (apply +)))

(defn part-2
  "Day 14 Part 2"
  [input]
  (->> (parse-program input)
       (exec
         (fn [{:keys [mask memory]} address value]
           (reduce #(assoc %1 %2 value) memory (decode-memory-addresses address mask))))
       :memory
       vals
       (apply +)))
