import { IndexedHeap } from "./IndexedHeap.js";
import { LinkedList } from "./LinkedList.js";

export class RollingMedian<T> {
  queue = new LinkedList<T>();
  lowHeap: IndexedHeap<T>;
  highHeap: IndexedHeap<T>;

  constructor(public comparator: (a: T, b: T) => number) {
    this.lowHeap = new IndexedHeap((a, b) => -this.comparator(a, b));
    this.highHeap = new IndexedHeap(this.comparator);
  }

  /** O(1) */
  size(): number {
    return this.queue.size;
  }

  /** O(1) */
  first(): T | undefined {
    return this.queue.first?.value;
  }

  /** O(log n) */
  push(item: T): void {
    this.queue.push(item);
    const median = this.median();
    if (median === undefined || this.comparator(item, median) <= 0) {
      this.lowHeap.push(item);
    } else {
      this.highHeap.push(item);
    }

    this.rebalance();
  }

  /** O(log n) */
  shift(): T | undefined {
    const item = this.queue.shift();
    if (item === undefined) return undefined;

    if (this.comparator(item, this.lowHeap.peek()!) <= 0) {
      this.lowHeap.delete(item);
    } else {
      this.highHeap.delete(item);
    }

    this.rebalance();

    return item;
  }

  /** O(1) */
  median(): T | undefined {
    return this.lowHeap.peek();
  }

  private rebalance(): void {
    while (this.lowHeap.size() > this.highHeap.size() + 1) {
      this.highHeap.push(this.lowHeap.pop()!);
    }
    while (this.highHeap.size() > this.lowHeap.size()) {
      this.lowHeap.push(this.highHeap.pop()!);
    }
  }
}
