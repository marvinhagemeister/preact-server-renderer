import * as chalk from "chalk";
import * as Benchmark from "benchmark";

/* tslint:disable no-console */
export const logWinner = (suite: any) =>
  console.log(
    "Fastest is " + chalk.green(suite.filter("fastest").map("name")) + "\n",
  );

export const logCycle = (event: any) => console.log(String(event.target));

export function createBenchmark(name: string, a: () => any, b: () => any) {
  return new Promise(resolve => {
    new Benchmark.Suite("Compact")
      .add("preact-render-to-string", a)
      .add("preact-stream-renderer", b)
      .on("cycle", logCycle)
      .on("complete", function(this: any) {
        logWinner(this);
        resolve();
      })
      .run({ async: true });
  });
}
