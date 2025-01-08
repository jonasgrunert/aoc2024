import Solution from "./solution.ts";

class Gate {
  #out: string;
  #type: "AND" | "XOR" | "OR";
  #ins: Record<string, string> = {};

  constructor(type: "AND" | "XOR" | "OR", out: string) {
    this.#out = out;
    this.#type = type;
  }

  #compute() {
    switch (this.#type) {
      case "AND":
        return Object.values(this.#ins).every((n) => n === "1");
      case "OR":
        return Object.values(this.#ins).some((n) => n === "1");
      case "XOR": {
        const [v1, v2] = Object.values(this.#ins);
        return v1 !== v2;
      }
    }
  }

  in(name: string, value: string) {
    this.#ins[name] = value;
    if (Object.keys(this.#ins).length !== 2) {
      return null;
    }
    return [this.#out, this.#compute() ? "1" : "0"];
  }

  get type() {
    return this.#type;
  }
}

const task = new Solution(
  (arr: string[][]) => {
    const gates = new Map<string, Gate[]>();
    const z = new Map<string, string>();
    for (const def of arr[1]) {
      const [i1, type, i2, _, out] = def.split(" ");
      const gate = new Gate(type as "AND" | "OR" | "XOR", out);
      gates.set(i1, (gates.get(i1) ?? []).concat([gate]));
      gates.set(i2, (gates.get(i2) ?? []).concat([gate]));
    }
    const ins = arr[0].map((n) => n.split(": "));
    while (ins.length > 0) {
      const [name, value] = ins.shift()!;
      if (name.startsWith("z")) {
        z.set(name, value);
      }
      for (const gate of (gates.get(name) ?? [])) {
        const o = gate.in(name, value);
        if (o !== null) {
          ins.push(o);
        }
      }
    }
    return Number.parseInt(
      z.entries().toArray().sort(([k1], [k2]) => k2.localeCompare(k1)).map((
        [, v],
      ) => v).join(""),
      2,
    );
  },
  (arr: string[][]) => {
    if (isTest) return "";
    // https://www.reddit.com/r/adventofcode/comments/1hl698z/comment/m3kt1je
    const wrong = new Set<string>();
    const gates = new Map<string, Gate[]>();
    let highestZ = 0;
    for (const def of arr[1]) {
      const [i1, type, i2, _, out] = def.split(" ");
      const gate = new Gate(type as "AND" | "OR" | "XOR", out);
      gates.set(i1, (gates.get(i1) ?? []).concat([gate]));
      gates.set(i2, (gates.get(i2) ?? []).concat([gate]));
      if (out.startsWith("z")) {
        highestZ = Math.max(Number.parseInt(out.slice(1)), highestZ);
      }
    }
    for (const def of arr[1]) {
      const [i1, type, i2, _, out] = def.split(" ");
      if (
        out.startsWith("z") && type != "XOR" &&
        !out.endsWith(highestZ.toString())
      ) {
        wrong.add(out);
      }
      if (
        type === "XOR" && [i1, i2, out].every((c) => !/^[xyz]/.test(c))
      ) {
        wrong.add(out);
      }
      if (type === "AND" && ![i1, i2].includes("x00")) {
        for (const g of gates.get(out) ?? []) {
          if (g.type !== "OR") {
            wrong.add(out);
          }
        }
      }
      if (type === "XOR") {
        for (const g of gates.get(out) ?? []) {
          if (g.type === "OR") {
            wrong.add(out);
          }
        }
      }
    }
    return wrong.values().toArray().sort().join(",");
  },
  {
    sep: "\n\n",
    transform: (s) => s.split("\n"),
  },
);
task.expect(2024, "");

export default task;
