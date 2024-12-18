import Solution from "./solution.ts";

const moves = [[">", 1], ["<", -1], ["^", -100], ["v", 100]] as [
  string,
  number,
][];
const second = [[">", 0.5], ["<", -0.5], ["^", -100], ["v", 100]] as [
  string,
  number,
][];

function toMap(
  maxX: number,
  maxY: number,
  walls: Set<number>,
  boxes: Set<number>,
  start: number,
  double = false,
) {
  let map = "";
  for (let x = 0; x < maxX; x++) {
    for (let y = 0; y < maxY; y++) {
      const pos = x * 100 + y;
      if (walls.has(pos)) map += "#";
      else if (boxes.has(pos)) {
        map += double ? "[]" : "O";
        y++;
      } else if (pos === start) map += "@";
      else map += ".";
    }
    map += "\n";
  }
  return map;
}

const task = new Solution(
  (arr: string[][]) => {
    const walls = new Set<number>();
    const boxes = new Set<number>();
    let start = 0;
    for (let x = 0; x < arr[0].length; x++) {
      for (let y = 0; y < arr[0][1].length; y++) {
        const pos = 100 * x + y;
        switch (arr[0][x][y]) {
          case "#": {
            walls.add(pos);
            break;
          }
          case "O": {
            boxes.add(pos);
            break;
          }
          case "@": {
            start = pos;
            break;
          }
        }
      }
    }
    const prog = arr[1].map((c) => moves.find((v) => c === v[0])!);
    for (const [_, i] of prog) {
      let move = start + i;
      while (boxes.has(move)) {
        move = move + i;
      }
      if (!walls.has(move)) {
        if (boxes.delete(start + i)) {
          boxes.add(move);
        }
        start = start + i;
      }
    }
    return boxes.values().reduce((p, c) => p + c);
  },
  (arr: string[][]) => {
    const walls = new Set<number>();
    const boxes = new Set<number>();
    let start = 0;
    for (let x = 0; x < arr[0].length; x++) {
      for (let y = 0; y < arr[0][1].length; y++) {
        const pos = 100 * x + y * 2;
        switch (arr[0][x][y]) {
          case "#": {
            walls.add(pos);
            walls.add(pos + 1);
            break;
          }
          case "O": {
            boxes.add(pos);
            break;
          }
          case "@": {
            start = pos;
            break;
          }
        }
      }
    }
    const prog = arr[1].map((c) => moves.find((v) => c === v[0])!);
    let c = 0;
    for (const [_, i] of prog) {
      c++;
      if (c > 0 && c <= 100) {
        console.log(
          toMap(arr[0].length, arr[0][0].length * 2, walls, boxes, start, true),
        );
      }
      let movedBoxes: number[] = [];
      let move: number[] = [start + i];
      while (
        move.every(m => !walls.has(m)) &&
        move.some((m) => boxes.has(m) || boxes.has(m - 1))
      ) {
        move = move.flatMap((m) => [m, m - 1]).filter((m) => boxes.has(m));
        movedBoxes = movedBoxes.concat(move);
        move = move.flatMap((m) => {
          if (i % 100 !== 0) return [m + (i === 1 ? 2 : -1)];
          return [m + i, m + i + 1];
        });
      }
      if (!move.some((b) => walls.has(b))) {
        for (const box of movedBoxes) {
          boxes.delete(box);
        }
        for (const box of movedBoxes) {
          boxes.add(box + i);
        }
        start = start + i;
      }
    }
    return boxes.values().reduce((p, c) => p + c);
  },
  {
    sep: "\n\n",
    transform: (s, i) =>
      i === 0 ? s.split("\n") : s.replaceAll("\n", "").split(""),
  },
);
task.expect(10092, 9021);

export default task;
