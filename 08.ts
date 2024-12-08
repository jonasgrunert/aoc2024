import Solution from "./solution.ts";

function inBounds(point: [number, number], bound: [number, number]) {
  return point.every((e, i) => e >= 0 && e < bound[i]);
}

function findAntidote(
  coords: [number, number][],
  bounds: [number, number],
  second = false,
): Set<string> {
  const antidotes = new Set<string>();
  const [stable, ...rest] = coords;
  for (const coord of rest) {
    const d = [stable[0] - coord[0], stable[1] - coord[1]];
    if (!second) {
      for (const sign of [-1, 2]) {
        const p = [stable[0] + (sign * d[0]), stable[1] + (sign * d[1])];
        antidotes.add(p.join(","));
      }
    } else {
      for (const sign of [-1, 1]) {
        for (
          let i = 0, p = stable;
          inBounds(p, bounds);
          i++,
            p = [stable[0] + (sign * i * d[0]), stable[1] + (sign * i * d[1])]
        ) {
          antidotes.add(p.join(","));
        }
      }
    }
  }
  return rest.length === 1
    ? antidotes
    : antidotes.union(findAntidote(rest, bounds, second));
}

function solve(arr: string[][], second = false) {
  const points = new Map<string, [number, number][]>();
  arr.forEach((l, x) =>
    l.forEach((c, y) => {
      if (c !== ".") {
        points.set(c, [...(points.get(c) ?? []), [x, y]]);
      }
    })
  );
  return points.values().reduce(
    (p, c) => p.union(findAntidote(c, [arr.length, arr[0].length], second)),
    new Set<string>(),
  ).size;
}

const task = new Solution(
  (arr: string[][]) => solve(arr),
  (arr: string[][]) => solve(arr, true),
  {
    sep: "\n",
    transform: (s) => s.split(""),
  },
);
task.expect(14, 34);

export default task;
