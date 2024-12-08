import Solution from "./solution.ts";

function can(
  target: number,
  ns: number[],
  second: boolean,
  current = 0,
): boolean {
  if (current > target) return false;
  if (ns.length === 0) return target === current;
  const next = ns.slice(1);
  return can(target, next, second, current + ns[0]) ||
    can(target, next, second, current * ns[0]) ||
    (second &&
      can(target, next, second, Number.parseInt(current + ns[0].toString())));
}

const task = new Solution(
  (arr: number[][]) =>
    arr.reduce((p, [t, ...ns]) => p + (can(t, ns, false) ? t : 0), 0),
  (arr: number[][]) =>
    arr.reduce((p, [t, ...ns]) => p + (can(t, ns, true) ? t : 0), 0),
  {
    sep: "\n",
    transform: (s) => s.split(/:? /g).map((n) => Number.parseInt(n)),
  },
);
task.expect(3749, 11387);

export default task;
