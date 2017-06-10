import { h } from "preact";
import * as Bench2 from "benchmark";
import { render, JsxRenderer } from "../dist/index";
import { view, viewSvg } from "./components";
import { logCycle, logWinner } from "./helpers";

/* tslint:disable:no-var-requires no-console */
const renderToString = require("preact-render-to-string/jsx");

const syncRenderer = new JsxRenderer();

export function bench2() {
  return new Promise(resolve => {
    new Bench2.Suite("Jsx")
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

export function bench3() {
  return new Promise(resolve => {
    new Bench2.Suite("Jsx Svg")
      .add("preact-render-to-string", async () => renderToString(viewSvg))
      .add("preact-stream-renderer", () => render(viewSvg, syncRenderer))
      .on("cycle", logCycle)
      .on("complete", function(this: any) {
        logWinner(this);
        resolve();
      })
      .run({ async: true });
  });
}
