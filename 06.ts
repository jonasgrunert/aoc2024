import Solution from "./solution.ts";

const dirs = [[1, 0, "v"], [0, -1, "<"], [-1, 0, "^"], [
  0,
  1,
  ">",
]] as const;

function getStart(arr: string[][]) {
  const [x, y] = arr.reduce((p, c, x) => {
    if (p !== undefined) return p;
    const y = c.findIndex((v) => v !== "." && v !== "#");
    return y !== -1 ? [x, y] as const : undefined;
  }, undefined as readonly [number, number] | undefined)!;
  const dir = dirs.findIndex((v) => v[2] === arr[x][y]);
  return [x, y, dir];
}

function calculatePath(
  arr: string[][],
  start = getStart(arr),
) {
  let [x, y, dir] = start;
  const visited = new Set<string>();
  const path: [number, number, number][] = [];
  while (x < arr.length && x >= 0 && y < arr[0].length && y >= 0) {
    const pos = [x, y, dir].join(",");
    if (visited.has(pos) && arr[x]?.[y] !== undefined) {
      return undefined;
    }
    path.push([x, y, dir]);
    visited.add(pos);
    const nx = x + dirs[dir][0];
    const ny = y + dirs[dir][1];
    if (arr[nx]?.[ny] === "#") {
      dir = (dir + 1) % 4;
    } else {
      x = nx;
      y = ny;
    }
  }
  return {
    visited: new Set([...visited].map((l) => l.slice(0, l.lastIndexOf(",")))),
    path,
  };
}

const task = new Solution(
  (arr: string[][]) => {
    return calculatePath(arr)!.visited.size;
  },
  (arr: string[][]) => {
    let obst = 0;
    const seen = new Set<string>();
    const { path } = calculatePath(arr)!;
    path.forEach(([x, y], i, a) => {
      if (i === 0) return;
      const pos = [x, y].join(",");
      const prev = arr[x][y];
      if (seen.has(pos) || prev === "#") return;
      arr[x][y] = "#";
      seen.add(pos);
      if (
        calculatePath(
          arr,
          a[i - 1],
        ) === undefined
      ) {
        obst++;
      }
      arr[x][y] = prev;
    });
    return obst;
  },
  {
    sep: "\n",
    transform: (s) => s.split(""),
  },
);
task.expect(41, 6);

export default task;
