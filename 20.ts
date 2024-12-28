import Solution from "./solution.ts";

const dir = [[0, 1], [1, 0], [0, -1], [-1, 0]];

function findPath(arr: string[]): Map<string, number> {
  const sx = arr.findIndex((c) => c.includes("S")), sy = arr[sx].indexOf("S");
  const start: [number, number] = [sx, sy];
  const path = new Map<string, number>();
  path.set(start.join(","), 0);
  for (
    let pos = start, i = 1;
    arr[pos[0]][pos[1]] !== "E";
    path.set(pos.join(","), i++)
  ) {
    pos = dir.map<[number, number]>((m) => [pos[0] + m[0], pos[1] + m[1]]).find(
      (
        [x, y],
      ) => !path.has(x + "," + y) && (arr[x][y] === "." || arr[x][y] === "E"),
    )!;
  }
  return path;
}

function possibleCoords(start: string, arr: string[], times: number) {
  const [x, y] = start.split(",").map((n) => Number.parseInt(n));
  const coords = new Map<string, number>();
  for (
    let nx = Math.max(0, x - times);
    nx < Math.min(x + times + 1, arr.length);
    nx++
  ) {
    for (
      let ny = Math.max(0, y - times);
      ny < Math.min(y + times + 1, arr[0].length);
      ny++
    ) {
      const d = Math.abs(nx - x) + Math.abs(ny - y);
      if (d <= times) {
        coords.set([nx, ny].join(","), d);
      }
    }
  }
  return coords;
}

function countCheats(min: number) {
  return (arr: string[]) => {
    let goodCuts = 0;
    const path = findPath(arr);
    for (const [p, c] of path) {
      // set of reachable tiles
      for (const [k, d] of possibleCoords(p, arr, min)) {
        if (path.has(k) && path.get(k)! - c - d >= (isTest ? 50 : 100)) {
          goodCuts++;
        }
      }
    }
    return goodCuts;
  };
}

const task = new Solution(
  countCheats(2),
  countCheats(20),
  {
    sep: "\n",
  },
);
task.expect(1, 285);

export default task;
