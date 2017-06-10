import { VNode } from "preact";
import JsxRenderer from "./JsxRenderer";
import { parse, Renderer } from "./Parser";

export default function renderSync(
  vnode: VNode,
  renderer: Renderer,
): Promise<string> {
  return new Promise((resolve, reject) => {
    renderer.onDone = (html: string) => resolve(html);
    parse(vnode, renderer);
  });
}
