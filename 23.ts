import Solution from "./solution.ts";

class PC {
  #name: string;
  #connections = new Set<PC>();

  constructor(name: string) {
    this.#name = name;
  }

  add(peer: PC) {
    this.#connections.add(peer);
  }

  canConnect(peer: PC) {
    return this.#connections.has(peer);
  }

  get connections() {
    return this.#connections;
  }

  get name() {
    return this.#name;
  }

  loop3() {
    return new Set(
      this.#connections.values().flatMap((p) =>
        p.#connections.values().filter((c) => c.canConnect(this)).map(
          (c) => [this.#name, p.#name, c.#name].sort().join(","),
        )
      ).toArray(),
    );
  }
}

const task = new Solution(
  (arr: string[][]) => {
    const pcs = new Map<string, PC>();
    for (const [pca, pcb] of arr) {
      const neta = pcs.get(pca) ?? new PC(pca);
      const netb = pcs.get(pcb) ?? new PC(pcb);
      neta.add(netb);
      netb.add(neta);
      pcs.set(pca, neta);
      pcs.set(pcb, netb);
    }
    const nets = pcs.values().reduce(
      (prev, pc) => pc.name.startsWith("t") ? pc.loop3().union(prev) : prev,
      new Set<string>(),
    );
    return nets.size;
  },
  (arr: string[][]) => {
    const pcs = new Map<string, PC>();
    for (const [pca, pcb] of arr) {
      const neta = pcs.get(pca) ?? new PC(pca);
      const netb = pcs.get(pcb) ?? new PC(pcb);
      neta.add(netb);
      netb.add(neta);
      pcs.set(pca, neta);
      pcs.set(pcb, netb);
    }
    // https://en.wikipedia.org/wiki/Bron%E2%80%93Kerbosch_algorithm
    function bronKerbosch(
      selected: Set<string>,
      candidates: Set<string>,
      excluded: Set<string>,
    ): Set<string> {
      if (candidates.size === 0 && excluded.size === 0) {
        return selected;
      }
      let max_clique = new Set<string>();
      for (const v of new Set(candidates)) {
        const nodes = new Set(
          pcs.get(v)?.connections.values().map((p) => p.name),
        ) ?? new Set();
        const clique = bronKerbosch(
          selected.union(
            new Set([v]),
          ),
          candidates.intersection(nodes),
          excluded.intersection(nodes),
        );
        if (clique.size > max_clique.size) {
          max_clique = clique;
        }
        candidates.delete(v);
        excluded.add(v);
      }
      return max_clique;
    }
    const clique = bronKerbosch(new Set(), new Set(pcs.keys()), new Set());
    return clique.values().toArray().sort().join(",");
  },
  {
    sep: "\n",
    transform: (s) => s.split("-"),
  },
);
task.expect(7, "co,de,ka,ta");

export default task;
