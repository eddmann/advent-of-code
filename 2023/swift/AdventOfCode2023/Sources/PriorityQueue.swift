public class PriorityQueue<T: Comparable> {
  private var queue: [T]

  public init() {
    self.queue = [T]()
  }

  @discardableResult
  public func add(_ item: T) -> Bool {
    self.queue.append(item)
    self.heapifyUp(from: self.queue.count - 1)
    return true
  }

  public func dequeue() -> T? {
    guard self.queue.count > 0 else {
      return nil
    }
    return self.popAndHeapifyDown()
  }

  private func popAndHeapifyDown() -> T {
    let firstItem = self.queue[0]

    if self.queue.count == 1 {
      self.queue.remove(at: 0)
      return firstItem
    }

    self.queue[0] = self.queue.remove(at: self.queue.count - 1)
    self.heapifyDown()
    return firstItem
  }

  private func heapifyUp(from index: Int) {
    var child = index
    var parent = (child - 1) / 2

    while parent >= 0 && self.queue[parent] > self.queue[child] {
      swap(parent, with: child)
      child = parent
      parent = (child - 1) / 2
    }
  }

  private func heapifyDown() {
    var parent = 0

    while true {
      let leftChild = (2 * parent) + 1
      if leftChild >= self.queue.count {
        break
      }

      let rightChild = (2 * parent) + 2
      var minChild = leftChild
      if rightChild < self.queue.count && self.queue[minChild] > self.queue[rightChild] {
        minChild = rightChild
      }

      if self.queue[parent] > self.queue[minChild] {
        self.swap(parent, with: minChild)
        parent = minChild
      } else {
        break
      }
    }
  }

  private func swap(_ firstIndex: Int, with secondIndex: Int) {
    let firstItem = self.queue[firstIndex]
    self.queue[firstIndex] = self.queue[secondIndex]
    self.queue[secondIndex] = firstItem
  }
}
