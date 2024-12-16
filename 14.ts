import Solution from "./solution.ts";

function parseRobot(input: string) {
  const [sx, sy, vx, vy] = input.matchAll(/-?\d+/g).map(([n]) =>
    Number.parseInt(n)
  ).toArray();
  return { sx, sy, vx, vy };
}
type Robot = ReturnType<typeof parseRobot>;

const mod = (n: number, d: number) => ((n % d) + d) % d;

const task = new Solution(
  (arr: Robot[]) => {
    const dim = isTest ? [7, 11] : [103, 101];
    const h = dim.map((n) => (n - 1) / 2);
    const pos = arr.map((p, i) => ({
      x: mod(p.sx + arr[i].vx * 100, dim[1]),
      y: mod(p.sy + arr[i].vy * 100, dim[0]),
    }));
    let tl = 0;
    let tr = 0;
    let bl = 0;
    let br = 0;
    for (const p of pos) {
      if (p.y < h[0]) {
        if (p.x < h[1]) {
          tl++;
        }
        if (p.x > h[1]) {
          tr++;
        }
      }
      if (p.y > h[0]) {
        if (p.x < h[1]) {
          bl++;
        }
        if (p.x > h[1]) {
          br++;
        }
      }
    }
    return tl * tr * bl * br;
  },
  (arr: Robot[]) => {
    if (isTest) return "";
    const dim = [103, 101];
    let pos = arr.map(({ sx, sy }) => ({ sx, sy }));
    let searching = true;
    let steps = 0;
    while (searching) {
      pos = pos.map((p, i) => ({
        sx: mod(p.sx + arr[i].vx, dim[1]),
        sy: mod(p.sy + arr[i].vy, dim[0]),
      }));
      const m = Object.groupBy(pos, ({ sx }) => sx);
      searching = Object.values(m).every((l) =>
        l!.sort((a, b) => a.sy - b.sy).reduce((p, c) => ({
          y: c.sy,
          count: p.y === c.sy - 1 ? p.count + 1 : 0,
          max: Math.max(p.count, p.max),
        }), { y: 0, count: 0, max: 0 }).max < 8
      );
      steps++;
    }
    let map = "\n\n";
    for (let y = 0; y < dim[0]; y++) {
      for (let x = 0; x < dim[1]; x++) {
        map += pos.some((p) => p.sx === x && p.sy === y) ? "#" : ".";
      }
      if (map) {
        map += "\n";
      }
    }
    return steps + map;
  },
  {
    sep: "\n",
    transform: parseRobot,
  },
);
task.expect(12, "");

export default task;
