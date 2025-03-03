export interface value {
    value: () => number
}

type node<T extends value> = {
    data: T,
    next: node<T> | null,
    prev: node<T> | null
}

export class dlist<T extends value> {
    head: node<T> | null = null;
    tail: node<T> | null = null;

    push(data: T) {
        const n: node<T> = {
            data: data,
            next: null,
            prev: null
        };

        if (!this.head || !this.tail) {
            this.head = n;
            this.tail = n;
            return;
        }

        let cur = this.head;
        while (cur.next) {
            if (data.value() < cur.data.value()) {
                n.next = cur;
                if (!cur.prev) {
                    this.head = n;
                } else {
                    n.prev = cur.prev;
                    cur.prev.next = n;
                }
                cur.prev = n;
                return;
            }
            cur = cur.next;
        }

        n.prev = this.tail;
        this.tail.next = n;
        this.tail = n;
    }

    popMin(): T | null {
        if (!this.head || !this.tail) {
            return null;
        }

        const min = this.head;
        this.head = min.next;

        if (!this.head) {
            this.head = null;
            this.tail = null;
        }
        return min.data;
    }

    popMax(): T | null {
        if (!this.head || !this.tail) {
            return null;
        }
        const max = this.tail;
        this.tail = max.prev;
        if (!this.tail) {
            this.head = null;
            this.tail = null;
        }
        return max.data;
    }

    isEmpty(): boolean {
        return this.head === null;
    }

    print() {
        let cur = this.head;
        while (cur) {
            console.log(cur.data.value());
            cur = cur.next;
        }
    }
}
