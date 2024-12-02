import Solution from "./solution.ts";

function isSafeTransition(
  p: number,
  c: number,
  d: "d" | "u" | "",
): { safe: boolean; dir: "d" | "u" | ""; p: number } {
  const dis = Math.abs(p - c);
  const dir: "d" | "u" = p > c ? "d" : "u";
  return {
    dir,
    safe: (d === "" || d === dir) && dis >= 1 && dis <= 3,
    p: c,
  };
}

function isSafe(arr: number[], dir = "", p = arr[0]) {
  return arr.slice(1).reduce(
    (p, c, i) => p.safe ? { ...isSafeTransition(p.p, c, p.dir), i: i + 1 } : p,
    { safe: true, dir: "", p: arr[0], i: 0 } as
      & ReturnType<typeof isSafeTransition>
      & {
        i: number;
      },
  );
}

const task = new Solution(
  (arr: number[][]) =>
    arr.reduce(
      (p, c) => p + (isSafe(c).safe ? 1 : 0),
      0,
    ),
  (arr: number[][]) => {
    return arr.reduce(
      (p, c) => {
        const safe = isSafe(c);
        if (safe.safe) {
          return p + 1;
        }
        if (
          isSafe(c.slice(0, safe.i - 2).concat(c.slice(safe.i - 1))).safe ||
          isSafe(c.slice(0, safe.i - 1).concat(c.slice(safe.i))).safe ||
          isSafe(c.slice(0, safe.i).concat(c.slice(safe.i + 1))).safe
        ) {
          return p + 1;
        }
        return p;
      },
      0,
    );
  },
  {
    sep: "\n",
    transform: (s) => s.split(" ").map((n) => Number.parseInt(n)),
  },
);
task.expect(2, 4);

export default task;
