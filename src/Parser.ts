import { VNode } from "preact";
import { escapeAttr as encode } from "vdom-utils";
import { getComponentName } from "./utils";

export interface Renderer {
  onProp(name: string, value: string): void;
  onOpenTag(name: string): void;
  onCloseTag(name: string): void;
  onDone(): void;
}

export interface Options {
  sort: boolean;
  shallow: boolean;
}

const defaultOpts: Options = {
  sort: false,
  shallow: false,
};

export function parse(
  vnode: VNode,
  renderer: Renderer,
  options: Partial<Options> = defaultOpts,
) {
  walk(vnode, renderer, {
    ...defaultOpts,
    ...options,
  });
  renderer.onDone();
}

export function walk(
  vnode: VNode | null | boolean,
  renderer: Renderer,
  options: Options,
) {
  if (
    vnode === null ||
    vnode === undefined ||
    vnode === false ||
    vnode === true
  ) {
    return;
  }

  const { attributes } = vnode;
  let { nodeName, children } = vnode;

  // Text node
  if (nodeName === undefined) {
    // rendererencode(vnode);
    console.log("FIXME");
    return;
  }

  // Component
  let isComponent = false;
  if (typeof nodeName === "function") {
    isComponent = true;
    if (options.shallow) {
      nodeName = getComponentName(nodeName);
      renderer.onOpenTag(nodeName);
    }
  } else {
    renderer.onOpenTag(nodeName);
  }

  if (attributes !== undefined) {
    let keys = Object.keys(attributes);
    if (options.sort) {
      keys = keys.sort();
    }

    for (let name of keys) {
      let value = attributes[name];

      if (value === true || value === false) {
        renderer.onProp(name, value);
        continue;
      } else if (name === "className") {
        if (attributes.class !== undefined) {
          continue;
        }
        name = "class";
      } else if (name === "style") {
        value = "STYLE";
      } else if (name === "children") {
        children = attributes.children;
        continue;
      }

      if (name === "dangerouslySetInnerHTML") {
        renderer.onProp(name, value.__html);
      } else {
        renderer.onProp(name, encode(value));
      }
    }
  }

  if (children !== undefined) {
    for (const child of children) {
      walk(child, renderer, options);
    }
  }
}
