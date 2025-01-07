import Solution from "./solution.ts";

const num = {
  "7": [0, 0],
  "8": [0, 1],
  "9": [0, 2],
  "4": [1, 0],
  "5": [1, 1],
  "6": [1, 2],
  "1": [2, 0],
  "2": [2, 1],
  "3": [2, 2],
  "0": [3, 1],
  "A": [3, 2],
} as const;

const dir = {
  "^": [0, 1],
  "A": [0, 2],
  "<": [1, 0],
  "v": [1, 1],
  ">": [1, 2],
} as const;

function createGraphs(pad: typeof dir | typeof num, invalid: [number, number]) {
  const graph = new Map<string, (keyof typeof dir)[]>();
  for (const [pos, [posx, posy]] of Object.entries(pad)) {
    for (const [target, [targetx, targety]] of Object.entries(pad)) {
      let path = ([
        [posy - targety, "<"],
        [targetx - posx, "v"],
        [posx - targetx, "^"],
        [targety - posy, ">"],
      ] as [number, keyof typeof dir][]).reduce(
        (p, [count, char]) => count > 0 ? p.concat(Array(count).fill(char)) : p,
        [] as (keyof typeof dir)[],
      );
      if (
        (posx === invalid[0] && targety === invalid[1]) ||
        (targetx === invalid[0] && posy === invalid[1])
      ) {
        path = path.toReversed();
      }
      graph.set([pos, target].join(";"), path.concat(["A"]));
    }
  }
  return graph;
}

function enter(levels: number) {
  const numGraph = createGraphs(num, [3, 0]);
  const dirGraph = createGraphs(dir, [0, 0]);

  const cache = new Map<string, number>();

  function numericSteps(code: string) {
    let complexity = 0;
    let pos = "A";
    for (const c of code) {
      complexity += calcSteps(numGraph.get([pos, c].join(";")) ?? [], levels);
      pos = c;
    }
    return complexity;
  }

  function calcSteps(inputs: (keyof typeof dir)[], level: number): number {
    if (level === 0) return inputs.length;
    const key = inputs.join(";") + level;
    const value = cache.get(key);
    if (value) return value;
    let pos = "A";
    let comp = 0;
    for (const c of inputs) {
      comp += calcSteps(dirGraph.get([pos, c].join(";")) ?? [], level - 1);
      pos = c;
    }
    cache.set(key, comp);
    return comp;
  }

  return (codes: string[]) =>
    codes.reduce((p, c) => p + numericSteps(c) * Number.parseInt(c), 0);
}

const task = new Solution(
  enter(2),
  enter(25),
  {
    sep: "\n",
  },
);
task.expect(126384, 154115708116294);

export default task;
