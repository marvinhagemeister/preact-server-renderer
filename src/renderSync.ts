import { VNode } from "preact";
import JsxRenderer from "./JsxRenderer";
import { parse } from "./Parser";

export default function renderSync(vnode: VNode): Promise<string> {
  return new Promise((resolve, reject) => {
    const renderer = new JsxRenderer(resolve);
    parse(vnode, renderer);
  });
}
