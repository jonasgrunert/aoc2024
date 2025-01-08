import Solution from "./solution.ts";

const mod = (n: number, d: number) => ((n % d) + d) % d;

const derive = (secret: number) => {
  const op = (n: number, s: number) => mod((s * n) ^ s, 16777216);
  return op(2048, op(1 / 32, op(64, secret)));
};

const task = new Solution(
  (arr: number[]) => {
    return arr.reduce((p, c) => {
      let v = c;
      for (let i = 0; i < 2000; i++) {
        v = derive(v);
      }
      return p + v;
    }, 0);
  },
  (arr: number[]) => {
    const prices = arr.reduce((map, secret) => {
      const seen = new Set<string>();
      const changes: number[] = [];
      let previous: number | null = null;
      for (let i = 0; i < 2000; i++) {
        const price = secret % 10;
        changes.push(previous !== null ? price - previous : 0);
        if (changes.length > 4) {
          changes.shift();
        }
        if (changes.length === 4) {
          const key = changes.join(",");
          if (!seen.has(key)) {
            seen.add(key);
            map.set(key, (map.get(key) ?? 0) + price);
          }
        }
        previous = price;
        secret = derive(secret);
      }
      return map;
    }, new Map<string, number>());
    return Math.max(...prices.values());
  },
  {
    sep: "\n",
    transform: (n) => Number.parseInt(n),
  },
);
task.expect(37327623, 23);

export default task;
