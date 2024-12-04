import Solution from "./solution.ts";

const task = new Solution(
  (arr: string[][]) => {
    const word = "XMAS";
    const dirs = [[0, 1], [1, 1], [1, 0], [1, -1]] as const;
    function checkSymbol(
      pos: readonly [number, number],
      char: number,
      dir: readonly [number, number],
    ) {
      if (char === 4 || char === -5) return true;
      const npos = [pos[0] + dir[0], pos[1] + dir[1]] as const;
      if (arr[npos[0]]?.[npos[1]] === word.at(char)) {
        return checkSymbol(npos, char + Math.sign(char) * 1, dir);
      }
      return false;
    }
    const count = arr.reduce((p, c, x) =>
      p + c.reduce((pc, s, y) => {
        if (s === "S") {
          return pc + dirs.filter((d) => checkSymbol([x, y], -2, d)).length;
        }
        if (s === "X") {
          return pc + dirs.filter((d) => checkSymbol([x, y], 1, d)).length;
        }
        return pc;
      }, 0), 0);
    return count;
  },
  (arr: string[][]) => {
    const pos = [-1, 1].flatMap((x, _, arr) => arr.map((y) => [x, y]));
    console.log(pos);
    const count = arr.reduce((p, c, x) =>
      p + c.filter((s, y) => {
        if (s === "A") {
          const str = pos.map((d) => arr[x + d[0]]?.[y + d[1]]).join("");
          return /(M|S)(M|S)(?!\2)[MS](?!\1)[MS]/.test(str);
        }
        return false;
      }).length, 0);
    return count;
  },
  {
    sep: "\n",
    transform: (s) => s.split(""),
  },
);
task.expect(18, 9);

export default task;
