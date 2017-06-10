import { h } from "preact";
import * as Bench2 from "benchmark";
import { render, JsxRenderer } from "../dist/index";
import { view } from "./components";

/* tslint:disable:no-var-requires no-console */
const renderToString = require("preact-render-to-string/jsx");

const syncRenderer = new JsxRenderer();

export function bench2() {
  const suite = new Bench2.Suite()
    .add("preact-render-to-string", async () => renderToString(view))
    .add("preact-stream-renderer", () => render(view, syncRenderer))
    .on("cycle", (event: any) => {
      console.log(String(event.target));
    })
    .on("complete", function(this: any) {
      console.log("Fastest is " + this.filter("fastest").map("name"));
    })
    .run({ async: true });
}
