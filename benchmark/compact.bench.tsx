import { h } from "preact";
import { createRenderer, CompactRenderer } from "../src/index";
import { view, view2 } from "./components";
import { createBenchmark, logCycle, logWinner } from "./helpers";

/* tslint:disable:no-var-requires no-console */
const renderToString = require("preact-render-to-string");

const syncRenderer = new CompactRenderer();

const options = { depth: 0, shallow: false, sort: false };
const render = createRenderer(syncRenderer, options);

export function bench1() {
  const fn = () => renderToString(view);
  const fn2 = () => render(view);
  return createBenchmark("Compact", fn, fn2);
}

export function bench4() {
  const fn = () => renderToString(view2);
  const fn2 = () => render(view2);
  return createBenchmark("Compact Big", fn, fn2);
}
