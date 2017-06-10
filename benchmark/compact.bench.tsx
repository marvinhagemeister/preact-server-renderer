import { h } from "preact";
import * as Benchmark from "benchmark";
import { render, CompactRenderer } from "../dist/index";
import { view } from "./components";
import { logCycle, logWinner } from "./helpers";

/* tslint:disable:no-var-requires no-console */
const renderToString = require("preact-render-to-string");

const syncRenderer = new CompactRenderer();

export function bench1() {
  return new Promise(resolve => {
    new Benchmark.Suite("Compact")
      .add("preact-render-to-string", async () => renderToString(view))
      .add("preact-stream-renderer", () => render(view, syncRenderer))
      .on("cycle", logCycle)
      .on("complete", function(this: any) {
        logWinner(this);
        resolve();
      })
      .run({ async: true });
  });
}
