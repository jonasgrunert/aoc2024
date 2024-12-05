import Solution from "./solution.ts";

for (
  const file of [...Deno.readDirSync(".")].sort((a, b) =>
    a.name.localeCompare(b.name)
  )
) {
  if (file.isFile && file.name.match(/\d{2}\.ts/)) {
    const { default: sol }: { default: Solution<unknown, unknown> } =
      await import(`./${file.name}`);
    sol.filename = file.name;
    sol.reader = (n) => {
      try {
        return Deno.readTextFileSync(`data/${n}.txt`);
      } catch (err) {
        if (err instanceof Deno.errors.NotFound) {
          throw new Error("File not found");
        }
        console.error(err);
        throw new Error();
      }
    };
    sol.reporter = (name, result, _, time) =>
      console.log(
        `${name}: ${
          typeof result === "string" ? result : Deno.inspect(result)
        } (${time ?? "-"} ms)`,
      );
    sol.execute();
  }
}
