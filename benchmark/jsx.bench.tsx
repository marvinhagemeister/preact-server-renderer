import Benchmark from "minibench";
import { h } from "preact";
import renderSync from "../src/renderSync";
import JsxRenderer from "../src/JsxRenderer";
import { view } from "./components";

/* tslint:disable:no-var-requires */
const renderToString = require("preact-render-to-string/jsx");

const syncRenderer = new JsxRenderer(() => {
  /* noop */
});

export default async function bench() {
  await new Benchmark()
    .add("preact-render-to-string", () => renderToString(view))
    .add("preact-stream-renderer", () => renderSync(view, syncRenderer))
    .run();
}
