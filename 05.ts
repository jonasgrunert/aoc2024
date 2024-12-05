import Solution from "./solution.ts";

function emptyRule() {
  return { before: new Set<number>(), after: new Set<number>() };
}

function createRules(arr: number[][]) {
  const rules = new Map<
    number,
    { before: Set<number>; after: Set<number> }
  >();
  for (const r of arr) {
    const prev = rules.get(r[0]) ?? emptyRule();

    prev.after.add(r[1]);
    rules.set(r[0], prev);
    const next = rules.get(r[1]) ?? emptyRule();
    next.before.add(r[0]);
    rules.set(r[1], next);
  }
  return rules;
}

function checkPage(
  i: number,
  pages: number[],
  rules: ReturnType<typeof createRules>,
) {
  const n = pages[i];
  const nonPrev = pages.slice(0, i).every((p) =>
    !(rules.get(n) ?? emptyRule()).after.has(
      p,
    )
  );
  const nonNext = pages.slice(i + 1).every((p) =>
    !(rules.get(n) ?? emptyRule()).before.has(
      p,
    )
  );
  return (nonNext && nonPrev);
}

function checkRules(
  rules: ReturnType<typeof createRules>,
  pages: number[][],
  pass = true,
) {
  const correct = pages.filter((u) =>
    u.every((_, i, arr) => checkPage(i, arr, rules)) === pass
  );
  return correct;
}

function fixPages(rules: ReturnType<typeof createRules>, pages: number[]) {
  const correct: number[] = [];
  for (let i = 0; i < pages.length; i++) {
    for (let k = 0; k <= correct.length; k++) {
      correct.splice(correct.length - k, 0, pages[i]);
      if (!checkPage(i - k, correct, rules)) {
        correct.splice(correct.length - k - 1, 1);
      } else {
        break;
      }
    }
  }
  return correct;
}

const task = new Solution(
  (arr: number[][][]) => {
    const rules = createRules(arr[0]);
    const correct = checkRules(rules, arr[1]);
    return correct.reduce((p, c) => p + c[(c.length - 1) / 2], 0);
  },
  (arr: number[][][]) => {
    const rules = createRules(arr[0]);
    const incorrect = checkRules(rules, arr[1], false);
    return incorrect.reduce(
      (p, c) => p + fixPages(rules, c)[(c.length - 1) / 2],
      0,
    );
  },
  {
    sep: "\n\n",
    transform: (s, i) => {
      return s.split("\n").map((l) =>
        l.split(i === 0 ? "|" : ",").map((n) => Number.parseInt(n))
      );
    },
  },
);
task.expect(143, 123);

export default task;
