import Solution from "./solution.ts";

class PrioQ {
  #values: Map<string, number>;
  #list: [number, number][];

  constructor(
    init: [
      [number, number],
      number,
    ][] = [],
  ) {
    this.#values = new Map(init.map(([n, v]) => [n.join(","), v]));
    this.#list = init.toSorted(([, v1], [, v2]) => v1 - v2).map(([n]) => n);
  }

  get(key: [number, number, number]) {
    return this.#values.get(key.join(","));
  }

  pop() {
    const v = this.#list.pop();
    if (v === undefined) {
      return null;
    }
    const n = this.#values.get(v.join(","));
    this.#values.delete(v.join(","));
    return [v, n] as [
      [number, number],
      number,
    ];
  }

  #bSearch(value: number) {
    let lower = 0, upper = this.#list.length - 1;
    while (lower <= upper) {
      const bound = upper + lower >>> 1;
      const comp = this.#values.get(
        this.#list[bound].join(","),
      ) ?? Number.MAX_SAFE_INTEGER;
      if (comp < value) {
        upper = bound - 1;
      } else if (comp > value) {
        lower = bound + 1;
      } else {
        return bound;
      }
    }
    return ~lower;
  }

  insert(
    key: [number, number],
    value: number,
  ) {
    if (this.#list.length === 0) {
      this.#values.set(key.join(","), value);
      this.#list.push(key);
      return;
    }
    const prev = this.#values.get(key.join(","));
    if (prev === undefined) {
      const insert = this.#bSearch(value);
      this.#values.set(key.join(","), value);
      this.#list.splice(insert >= 0 ? insert : ~insert, 0, key);
      return;
    }
    if (value < prev) {
      let inserted = false, deleted = false;
      let i = 0;
      while (i < this.#list.length && (!(inserted && deleted))) {
        const k = this.#list[i].join(",");
        if (!deleted && k === key.join(",")) {
          this.#list.splice(i, 1);
          deleted = true;
          continue;
        }
        if (!inserted && this.#values.get(k)! > value) {
          this.#list.splice(i, 0, key);
          inserted = true;
          i++;
        }
        i++;
      }
      this.#values.set(key.join(","), value);
      return;
    }
  }
}

const dirs = [[0, 1], [1, 0], [0, -1], [-1, 0]];

function djikstra(bounds: number, bytes: [number, number][]) {
  const start: [number, number] = [0, 0];
  const end = [bounds, bounds];
  const b = new Set(bytes.map((b) => b.join(",")));
  const queue = new PrioQ([[start, 0]]);
  const visited = new Set<string>();
  let node = queue.pop();
  for (
    ;
    node !== null && !(node[0][0] === end[0] && node[0][1] === end[1]);
    node = queue.pop()
  ) {
    const [point, distance] = node;
    const key = point.join(",");
    visited.add(key);
    for (const d of dirs) {
      const x = point[0] + d[0];
      const y = point[1] + d[1];
      const p = [x, y] as [number, number];
      if (
        x >= 0 && x <= bounds && y >= 0 && y <= bounds && !b.has(p.join(",")) &&
        !visited.has(p.join(","))
      ) {
        queue.insert(p, distance + 1);
      }
    }
  }
  return node === null ? null : node[1];
}

const task = new Solution(
  (arr: [number, number][]) => {
    const bounds = isTest ? 6 : 70;
    return djikstra(bounds, arr.slice(0, isTest ? 12 : 1024));
  },
  (arr: [number, number][]) => {
    const bounds = isTest ? 6 : 70;
    let lower = isTest ? 12 : 1024;
    let upper = arr.length - 1;
    while (lower <= upper) {
      const bound = lower + upper >>> 1;
      const comp = djikstra(bounds, arr.slice(0, bound));
      if (comp === null) {
        upper = bound - 1;
      } else {
        lower = bound + 1;
      }
    }
    return arr[upper].join(",");
  },
  {
    sep: "\n",
    transform: (s) =>
      s.split(",").map((n) => Number.parseInt(n)) as [number, number],
  },
);
task.expect(22, "6,1");

export default task;
