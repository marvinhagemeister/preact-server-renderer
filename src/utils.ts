import { VNode, ComponentConstructor } from "preact";

export function createVNode(tag: string = "div"): VNode {
  return {
    nodeName: tag,
    attributes: undefined,
    children: undefined,
    key: undefined,
  };
}

const ESC: Record<string, string> = {
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "&": "&amp;",
};

const escapeChar = (a: string) => ESC[a] || a;

export function encode(s: any) {
  return String(s).replace(/[<>"&]/g, escapeChar);
}

export function getComponentName(component: ComponentConstructor<any, any>) {
  return component.name;
}
