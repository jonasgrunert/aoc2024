import Solution from "./solution.ts";

const dirs = [[0, 1], [1, 0], [0, -1], [-1, 0]];

function countEnds(
  pos: [number, number],
  arr: number[][],
  visited: Map<string, Set<string>>,
): Set<string> {
  const h = pos.join(",");
  const vis = visited.get(h)!;
  if (vis) return vis;
  const v = arr[pos[0]][pos[1]];
  if (v === 9) return new Set([h]);
  const ends = dirs.reduce((p, d) => {
    const x = pos[0] + d[0];
    const y = pos[1] + d[1];
    return p.union(
      v + 1 === arr[x]?.[y] ? countEnds([x, y], arr, visited) : new Set(),
    );
  }, new Set<string>());
  visited.set(h, ends);
  return ends;
}

function countPaths(
  pos: [number, number],
  arr: number[][],
  visited: Map<string, number>,
): number {
  const h = pos.join(",");
  if (visited.has(h)) return visited.get(h) ?? 0;
  const v = arr[pos[0]][pos[1]];
  if (v === 9) return 1;
  const ends = dirs.reduce((p, d) => {
    const x = pos[0] + d[0];
    const y = pos[1] + d[1];
    return p + (v + 1 === arr[x]?.[y] ? countPaths([x, y], arr, visited) : 0);
  }, 0);
  visited.set(h, ends);
  return ends;
}

const task = new Solution(
  (arr: number[][]) => {
    const visited = new Map<string, Set<string>>();
    let sum = 0;
    for (let x = 0; x < arr.length; x++) {
      for (let y = 0; y < arr[0].length; y++) {
        if (arr[x][y] === 0) {
          sum += countEnds([x, y], arr, visited).size;
        }
      }
    }
    return sum;
  },
  (arr: number[][]) => {
    const visited = new Map<string, number>();
    let sum = 0;
    for (let x = 0; x < arr.length; x++) {
      for (let y = 0; y < arr[0].length; y++) {
        if (arr[x][y] === 0) {
          sum += countPaths([x, y], arr, visited);
        }
      }
    }
    return sum;
  },
  {
    sep: "\n",
    transform: (s) => s.split("").map((n) => Number.parseInt(n)),
  },
);
task.expect(36, 81);

export default task;
