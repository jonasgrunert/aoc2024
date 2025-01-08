import Solution from "./solution.ts";

const task = new Solution(
  (arr: string[][]) => {
    const height = arr[0].length - 1;
    const locks: number[][] = [];
    const keys: number[][] = [];
    for (const schema of arr) {
      if (/^#*$/.test(schema[0])) {
        locks.push(schema.reduce(
          (p, c, i) => p.map((a, x) => c[x] === "#" ? i : a),
          Array(schema[0].length).fill(0),
        ));
      } else {
        keys.push(schema.reduce(
          (p, c, i) => p.map((a, x) => c[x] === "#" ? a : height - i - 1),
          Array(schema[0].length).fill(0),
        ));
      }
    }
    let count = 0;
    for (const lock of locks) {
      for (const key of keys) {
        if (lock.every((n, i) => n + key[i] < height)) {
          count++;
        }
      }
    }
    return count;
  },
  {
    sep: "\n\n",
    transform: (s) => s.split("\n"),
  },
);
task.expect(3);

export default task;
