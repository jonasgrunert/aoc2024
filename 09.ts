import Solution from "./solution.ts";

const task = new Solution(
  (arr: number[]) => {
    const comp: number[] = [];
    for (let i = 0; i < arr.length; i++) {
      if (i % 2 === 0) {
        comp.push(...Array(arr[i]).fill(i / 2));
      } else {
        let insert = arr[i];
        while (insert > 0) {
          if (arr.length % 2 === 0) arr.pop();
          let rem = arr.pop()!;
          const fillAmount = Math.min(rem, insert);
          rem -= fillAmount;
          insert -= fillAmount;
          comp.push(...Array(fillAmount).fill(arr.length / 2));
          if (rem !== 0) arr.push(rem);
        }
      }
    }
    return comp.reduce((p, c, i) => p + c * i, 0);
  },
  (arr: number[]) => {
    const comp: number[] = [];
    for (let i = 0; i < arr.length; i++) {
      if (i % 2 === 0 && arr[i] > 0) {
        comp.push(...Array(arr[i]).fill(i / 2));
      } else {
        let insert = Math.abs(arr[i]);
        for (let j = arr.length - 1; insert > 0 && j > i; j -= 2) {
          if (arr[j] > 0 && arr[j] <= insert) {
            insert -= arr[j];
            comp.push(...Array(arr[j]).fill(j / 2));
            arr[j] = -arr[j];
          }
        }
        comp.push(...Array(insert).fill(0));
      }
    }
    return comp.reduce((p, c, i) => p + c * i, 0);
  },
  {
    sep: "",
    transform: (n) => Number.parseInt(n),
  },
);
task.expect(1928, 2858);

export default task;
