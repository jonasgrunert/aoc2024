import Solution from "./solution.ts";

const dirs = [[-1, 0], [0, 1], [1, 0], [0, -1]];

function calcArea(
  arr: string[][],
  [x, y]: [number, number],
  visited: Set<string>,
  second = false,
): { area: number; perimeter: number; corners: number } {
  const pos = [x, y].join(",");
  if (visited.has(pos)) return { area: 0, perimeter: 0, corners: 0 };
  const c = arr[x][y];
  const n = dirs.map((d) => {
    const nx = x + d[0];
    const ny = y + d[1];
    return [nx, ny];
  });
  const same = n.filter(([nx, ny]) => arr[nx]?.[ny] === c);
  const corners = n.filter(([nx, ny], i) => {
    const od = dirs[(i + 1) % 4];
    const curr_side = arr[nx]?.[ny];
    const next_side = arr[x + od[0]]?.[y + od[1]];
    const corn = arr[nx + od[0]]?.[ny + od[1]];
    if (curr_side === c && next_side === c) {
      return corn !== c;
    }
    return curr_side !== c && next_side !== c;
  });
  const count = {
    area: 1,
    perimeter: dirs.length - same.length,
    corners: corners.length,
  };
  visited.add(pos);
  return same.reduce((p, [x, y]) => {
    const a = calcArea(arr, [x, y], visited, second);
    return {
      area: a.area + p.area,
      perimeter: a.perimeter + p.perimeter,
      corners: a.corners + p.corners,
    };
  }, count);
}

const task = new Solution(
  (arr: string[][]) => {
    let sum = 0;
    const visited = new Set<string>();
    for (let x = 0; x < arr.length; x++) {
      for (let y = 0; y < arr[0].length; y++) {
        const m = calcArea(arr, [x, y], visited);
        sum += m.perimeter * m.area;
      }
    }
    return sum;
  },
  (arr: string[][]) => {
    let sum = 0;
    const visited = new Set<string>();
    for (let x = 0; x < arr.length; x++) {
      for (let y = 0; y < arr[0].length; y++) {
        const m = calcArea(arr, [x, y], visited, true);
        sum += m.corners * m.area;
      }
    }
    return sum;
  },
  {
    sep: "\n",
    transform: (s) => s.split(""),
  },
);
task.expect(1930, 1206);

export default task;
