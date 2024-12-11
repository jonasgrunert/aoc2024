import Solution from "./solution.ts";

function producedStones(
  n: number,
  i: number,
  cache = new Map<string, number>(),
): number {
  if (i === 0) return 1;
  const id = [n, i].join(",");
  if (cache.has(id)) return cache.get(id)!;
  let val = 0;
  if (n === 0) val = producedStones(1, i - 1, cache);
  else {
    const s = n.toString();
    if (s.length % 2 === 0) {
      val = [s.slice(0, s.length / 2), s.slice(s.length / 2)].reduce(
        (p, n) => p + producedStones(Number.parseInt(n), i - 1, cache),
        0,
      );
    } else val = producedStones(n * 2024, i - 1, cache);
  }
  cache.set(id, val);
  return val;
}

const task = new Solution(
  (arr: number[]) => {
    let stones = 0;
    for (const stone of arr) {
      stones += producedStones(stone, 25);
    }
    return stones;
  },
  (arr: number[]) => {
    let stones = 0;
    for (const stone of arr) {
      stones += producedStones(stone, 75);
    }
    return stones;
  },
  {
    sep: " ",
    transform: (n) => Number.parseInt(n),
  },
);
task.expect(55312, 65601038650482);

export default task;
