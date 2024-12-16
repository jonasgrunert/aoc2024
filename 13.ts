import Solution from "./solution.ts";

function parseMachine(input: string) {
  const [ax, ay, bx, by, px, py] = input.matchAll(/\d+/g).map(([n]) =>
    Number.parseInt(n)
  ).toArray();
  return { ax, ay, bx, by, px, py };
}
type Machine = ReturnType<typeof parseMachine>;

const divmod = (a: number, b: number) => {
  const rem = a % b;
  return [(a - rem) / b, rem];
};

function solveMachine(m: Machine, max?: number) {
  // cramer rule based on matrices https://www.reddit.com/r/adventofcode/comments/1hd7irq/2024_day_13_an_explanation_of_the_mathematics/
  const det = m.ax * m.by - m.ay * m.bx;
  if (det === 0) return 0;
  const [a, arem] = divmod(m.px * m.by - m.py * m.bx, det);
  const [b, brem] = divmod(m.ax * m.py - m.ay * m.px, det);
  if (max && (a > 100 || b > 100)) return 0;
  return arem || brem ? 0 : a * 3 + b;
}

const task = new Solution(
  (arr: Machine[]) => {
    return arr.reduce((p, c) => p + solveMachine(c, 100), 0);
  },
  (arr: Machine[]) => {
    return arr.reduce(
      (p, c) =>
        p +
        solveMachine({
          ...c,
          px: c.px + 10_000_000_000_000,
          py: c.py + 10_000_000_000_000,
        }),
      0,
    );
  },
  {
    sep: "\n\n",
    transform: parseMachine,
  },
);
task.expect(480, 875318608908);

export default task;
