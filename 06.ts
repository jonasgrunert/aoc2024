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

function skipMap(arr: string[][]) {
  const map = new Map<string, string | undefined>();
  const px: number[] = arr[0].map(() => -1);
  const nx: number[] = arr[0].map((_, y) =>
    arr.findIndex((l) => l[y] === "#") - 1
  );
  for (let x = 0; x < arr.length; x++) {
    let py = -1;
    let ny = arr[x].indexOf("#") - 1;
    for (let y = 0; y < arr[0].length; y++) {
      if (arr[x][y] === "#") {
        px[y] = x + 1;
        py = y + 1;
        ny = arr[x].indexOf("#") - 1;
        nx[y] = arr.slice(x).findIndex((l) => l[y] === "#") - 1;
      }
      map.set(
        [x, y, 0].join(","),
        nx[y] < 0 ? undefined : [nx[y], y, 1].join(","),
      );
      map.set([x, y, 1].join(","), py < 0 ? undefined : [x, py, 2].join(","));
      map.set(
        [x, y, 2].join(","),
        px[y] < 0 ? undefined : [px[y], y, 3].join(","),
      );
      map.set(
        [x, y, 3].join(","),
        ny < 0 ? undefined : [x, ny, 0].join(","),
      );
    }
  }
  return map;
}

function useSkipMap(arr: string[][]) {
  const start = getStart(arr);
  const skip = skipMap(arr);
  for (
    let p: string | undefined = start.join(",");
    p !== undefined;
    p = skip.get(p)
  ) {
    console.log(p);
  }
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
