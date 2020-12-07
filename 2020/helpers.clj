(defn read-lines [filename]
  (clojure.string/split (slurp filename) #"\n"))

(defn read-line-groups [filename]
  (clojure.string/split (slurp filename) #"\n\n"))
