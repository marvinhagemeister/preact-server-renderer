import Benchmark from "minibench";
import { h } from "preact";
import renderSync from "../src/renderSync";
import JsxRenderer from "../src/JsxRenderer";
import { view } from "./components";
import * as Bench2 from "benchmark";

/* tslint:disable:no-var-requires no-console */
const renderToString = require("preact-render-to-string/jsx");

const syncRenderer = new JsxRenderer(() => {
  /* noop */
});

export default async function bench() {
  await new Benchmark()
    .add("preact-stream-renderer", () => renderSync(view, syncRenderer))
    .add("preact-render-to-string", () => renderToString(view))
    .run();
}

export function bench2() {
  new Bench2.Suite()
    .add("preact-render-to-string", () => renderToString(view))
    .add("preact-stream-renderer", () => renderSync(view, syncRenderer))
    .on("cycle", (event: any) => {
      console.log(String(event.target));
    })
    .on("complete", function() {
      console.log("Fastest is " + this.filter("fastest").map("name"));
    })
    .run({ async: true });
}
