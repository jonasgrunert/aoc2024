import Solution from "./solution.ts";

function match(available: string[], desired: string): boolean {
  if (desired.length === 0) return true;
  return available.some((p) =>
    desired.startsWith(p) ? match(available, desired.slice(p.length)) : false
  );
}

function count(
  available: string[],
  desired: string,
  known = new Map<string, number>(),
): number {
  if (desired.length === 0) return 1;
  if (known.has(desired)) return known.get(desired)!;
  const v = available.reduce(
    (p, c) =>
      p +
      (desired.startsWith(c)
        ? count(available, desired.slice(c.length), known)
        : 0),
    0,
  );
  known.set(desired, v);
  return v;
}

const task = new Solution(
  (arr: string[][]) => arr[1].filter((design) => match(arr[0], design)).length,
  (arr: string[][]) => {
    // dynamic programming here
    return arr[1].reduce((p, design) => p + count(arr[0], design), 0);
  },
  {
    sep: "\n\n",
    transform: (s, i) => s.split(i === 0 ? ", " : "\n"),
  },
);
task.expect(6, 16);

export default task;
