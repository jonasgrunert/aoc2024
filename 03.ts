import Solution from "./solution.ts";

const task = new Solution(
  (arr: string[]) => {
    return arr.reduce(
      (s, str) =>
        s + [...str.matchAll(/mul\((\d{1,3}),(\d{1,3})\)/g)].reduce(
          (p, c) =>
            p + c.slice(1).reduce((pn, cn) => pn * Number.parseInt(cn), 1),
          0,
        ),
      0,
    );
  },
  (arr: string[]) => {
    const reg = /(?:mul\((\d{1,3}),(\d{1,3})\)|don't\(\)|do\(\))/gs;
    let match;
    let sum = 0;
    let allow = true;
    while ((match = reg.exec(arr[0])) !== null) {
      if (match[0] === "do()") allow = true;
      else if (match[0] === "don't()") allow = false;
      else if (allow) {
        sum += match.slice(1).reduce((p, c) => p * Number.parseInt(c), 1);
      }
    }
    return sum;
  },
  {
    sep: "\n\n",
  },
);
task.expect(161, 48);

export default task;
