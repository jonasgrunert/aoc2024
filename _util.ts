import Solution from "./solution.ts";

for (const file of [...Deno.readDirSync(".")].sort((a, b) => a.name.localeCompare(b.name))) {
  if (file.isFile && file.name.match(/\d{2}\.ts/)) {
    const { default: sol }: { default: Solution<unknown, unknown> } =
      await import(`./${file.name}`);
    sol.filename = file.name;
    sol.reader = (n) => Deno.readTextFileSync(`data/${n}.txt`);
    sol.reporter = (name, result, _, time) =>
      console.log(
        `${name}: ${
          typeof result === "string" ? result : Deno.inspect(result)
        } (${time} ms)`,
      );
    sol.execute();
  }
}
