import Solution from "./solution.ts";

const mod = (n: number, d: number) => ((n % d) + d) % d;

function run(register: [number, number, number], code: number[]) {
  let [a, b, c] = register;
  const ops = code;
  let pointer = 0;
  const out: number[] = [];
  while (pointer < ops.length) {
    const op = ops[pointer + 1];
    const combo = () => {
      switch (op) {
        case 4:
          return a;
        case 5:
          return b;
        case 6:
          return c;
        default:
          return op;
      }
    };
    switch (ops[pointer]) {
      case 0: {
        a = Math.floor(a / 2 ** combo());
        break;
      }
      case 1: {
        b ^= op;
        break;
      }
      case 2: {
        b = mod(combo(), 8);
        break;
      }
      case 3: {
        if (a !== 0) {
          pointer = Number(op);
          continue;
        }
        break;
      }
      case 4: {
        b ^= c;
        break;
      }
      case 5: {
        out.push(mod(combo(), 8));
        break;
      }
      case 6: {
        b = Math.floor(a / 2 ** combo());
        break;
      }
      case 7: {
        c = Math.floor(a / 2 ** combo());
        break;
      }
    }
    pointer += 2;
  }
  return { out, a, b, c };
}

const task = new Solution(
  (arr: number[][]) => {
    return run(arr[0] as [number, number, number], arr[1]).out.join(",");
  },
  (arr: number[][]) => {
    let a = 0,
      quine = run([a, arr[0][1], arr[0][2]], arr[1]).out;
    const m = Array(arr[1].length).fill(0);
    for (let i = arr[1].length - 1; i >= 0; i--) {
      while (
        quine.length < arr[1].length ||
        quine.slice(i).join(",") !== arr[1].slice(i).join(",")
      ) {
        m[i]++;
        a = m.reduce((p, c, i) => p + c * 8 ** i);
        quine = run([a, arr[0][1], arr[0][2]], arr[1]).out;
      }
    }
    return a;
  },
  {
    sep: "\n\n",
    transform: (s) =>
      s.matchAll(/\d+/g).map(([n]) => Number.parseInt(n)).toArray(),
  },
);
task.expect("4,6,3,5,6,3,5,2,1,0", 117440);

export default task;
