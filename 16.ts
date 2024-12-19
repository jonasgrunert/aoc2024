import Solution from "./solution.ts";

type Point = { distance: number; previous: string[] };

class PrioQ {
  #values: Map<string, Point>;
  #list: [number, number, number][];

  constructor(
    init: [
      [number, number, number],
      Point,
    ][] = [],
  ) {
    this.#values = new Map(init.map(([n, v]) => [n.join(","), v]));
    this.#list = init.toSorted(([, v1], [, v2]) => v1.distance - v2.distance)
      .map(([s]) => s);
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
      [number, number, number],
      Point,
    ];
  }

  #bSearch(value: number) {
    let lower = 0, upper = this.#list.length - 1;
    while (lower <= upper) {
      const bound = upper + lower >>> 1;
      const { distance: comp } = this.#values.get(
        this.#list[bound].join(","),
      ) ?? { distance: Number.MAX_SAFE_INTEGER };
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
    key: [number, number, number],
    value: Point,
  ) {
    if (this.#list.length === 0) {
      this.#values.set(key.join(","), value);
      this.#list.push(key);
      return;
    }
    const prev = this.#values.get(key.join(","));
    if (prev === undefined) {
      const insert = this.#bSearch(value.distance);
      this.#values.set(key.join(","), value);
      this.#list.splice(insert >= 0 ? insert : ~insert, 0, key);
      return;
    }
    if (value.distance < prev.distance) {
      let inserted = false, deleted = false;
      let i = 0;
      while (i < this.#list.length && (!(inserted && deleted))) {
        const k = this.#list[i].join(",");
        if (!deleted && k === key.join(",")) {
          this.#list.splice(i, 1);
          deleted = true;
          continue;
        }
        if (!inserted && this.#values.get(k)!.distance > value.distance) {
          this.#list.splice(i, 0, key);
          inserted = true;
          i++;
        }
        i++;
      }
      this.#values.set(key.join(","), value);
      return;
    }
    if (value.distance === prev.distance) {
      this.#values.set(key.join(","), {
        ...prev,
        previous: prev.previous.concat(value.previous),
      });
    }
  }
}

// east 0

const mod = (n: number, d: number) => ((n % d) + d) % d;
const dirs = [[0, 1], [1, 0], [0, -1], [-1, 0]];

function djikstra(arr: string[]) {
  let start: [number, number, number], end: [number, number];
  for (let x = 0; x < arr.length; x++) {
    for (let y = 0; y < arr[0].length; y++) {
      if (arr[x][y] === "S") start = [x, y, 0];
      if (arr[x][y] === "E") end = [x, y];
    }
  }
  // @ts-expect-error I know it is assigned
  const queue = new PrioQ([[start, { distance: 0 }]]);
  const visited = new Map<string, string[]>();
  let [point, distance] = queue.pop()!;
  for (
    ;
    //@ts-expect-error I know end exists
    point !== null && !(point[0] === end[0] && point[1] === end[1]);
    [point, distance] = queue.pop()!
  ) {
    const key = point.join(",");
    visited.set(key, distance.previous ?? []);
    const opts = [[point[2], 1], [mod(point[2] + 1, 4), 1001], [
      mod(point[2] - 1, 4),
      1001,
    ]];
    for (const d of opts) {
      const x = point[0] + dirs[d[0]][0];
      const y = point[1] + dirs[d[0]][1];
      const p = [x, y, d[0]] as [number, number, number];
      if (arr[x][y] !== "#" && !visited.has(p.join(","))) {
        queue.insert(p, {
          distance: distance.distance + d[1],
          previous: [key],
        });
      }
    }
  }
  return { visited, final: distance };
}

const task = new Solution(
  (arr: string[]) => {
    return djikstra(arr).final.distance;
  },
  (arr: string[]) => {
    const path = djikstra(arr);
    const tiles = new Set<string>(
      path.final.previous!.slice(0, path.final.previous?.lastIndexOf(",")),
    );
    const queue = path.final.previous ?? [];
    for (let point = queue.pop(); point !== undefined; point = queue.pop()) {
      const n = path.visited.get(point)!;
      for (const p of n) {
        const coords = p.slice(0, p.lastIndexOf(","));
        tiles.add(coords);
        queue.push(p);
      }
    }
    return tiles.size + 2;
  },
  {
    sep: "\n",
  },
);
task.expect(7036, 45);

export default task;
