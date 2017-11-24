import { h } from "preact";
import { createRenderer, JsxRenderer } from "../src/index";
import { view, viewSvg } from "./components";
import { createBenchmark } from "./helpers";

/* tslint:disable:no-var-requires no-console no-submodule-imports */
const renderToString = require("preact-render-to-string/jsx");

const renderer = new JsxRenderer();

const options = { depth: 0, shallow: false, sort: false };
const render = createRenderer(renderer, options);

export function bench2() {
  const fn = () => renderToString(view);
  const fn2 = () => render(view);
  return createBenchmark("Jsx", fn, fn2);
}

export function bench3() {
  const fn = () => renderToString(viewSvg);
  const fn2 = () => render(viewSvg);
  return createBenchmark("Jsx SVG", fn, fn2);
}
