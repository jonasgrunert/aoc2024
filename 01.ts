import Solution from "./solution.ts";

const task = new Solution(
  (arr: number[][]) => {
    const sorted = arr.reduce(([a, b], [ca, cb]) => [[...a, ca], [...b, cb]], [
      [] as number[],
      [] as number[],
    ]).map((a) => a.sort());
    return sorted[0].reduce((p, c, i) => p + (Math.abs(c - sorted[1][i])), 0);
  },
  (arr: number[][]) => {
    const left = new Map<number, number>();
    const right = new Map<number, number>();
    for (const c of arr) {
      left.set(c[0], (left.get(c[0]) ?? 0) + 1);
      right.set(c[1], (right.get(c[1]) ?? 0) + 1);
    }
    return [...left].reduce((p, [k, v]) => p + k * (right.get(k) ?? 0) * v, 0);
  },
  {
    sep: "\n",
    transform: (s) => s.split("   ").map((n) => Number.parseInt(n)),
  },
);
task.expect(11, 31);

export default task;
