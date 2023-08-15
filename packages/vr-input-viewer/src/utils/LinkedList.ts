export class LinkedList<T> {
  first: LinkedListNode<T> | undefined;
  last: LinkedListNode<T> | undefined;
  size = 0;

  /** O(1) */
  push(value: T) {
    const prevLast = this.last;
    this.last = new LinkedListNode(value);
    this.size++;
    if (prevLast) {
      this.last.prev = prevLast;
      prevLast.next = this.last;
    } else {
      this.first = this.last;
    }
  }

  /** O(1) */
  shift(): T | undefined {
    if (!this.first) return undefined;
    const value = this.first.value;
    this.first = this.first.next;
    this.size--;
    if (this.first) {
      this.first.prev = undefined;
    } else {
      this.last = undefined;
    }
    return value;
  }
}

export class LinkedListNode<T> {
  next: LinkedListNode<T> | undefined;
  prev: LinkedListNode<T> | undefined;
  constructor(public value: T) {}
}
