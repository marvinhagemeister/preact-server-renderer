import { VNode } from "preact";
import { escapeAttr as encode, VOID_ELEMENTS } from "vdom-utils";
import { getComponentName } from "./utils";

export interface Renderer {
  onProp(name: string, value: string, depth: number): void;
  onOpenTag(
    name: string,
    hasChildren: boolean,
    isVoid: boolean,
    depth: number,
  ): void;
  onOpenTagClose(
    name: string,
    hasAttributes: boolean,
    isVoid: boolean,
    hasChildren: boolean,
    depth: number,
  ): void;
  onTextNode(text: string, depth: number): void;
  onCloseTag(name: string, isVoid: boolean, depth: number): void;
  onDone(): void;
}

export interface Options {
  sort: boolean;
  shallow: boolean;
  depth?: number;
}

const defaultOpts: Options = {
  sort: false,
  shallow: false,
  depth: 0,
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
  vnode: VNode | string | null | boolean,
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

  const { depth, shallow, sort } = options;

  // Text node
  if (typeof vnode === "string") {
    renderer.onTextNode(vnode, depth);
    return;
  }

  const { attributes } = vnode;
  let { nodeName, children } = vnode;

  // Component
  let isComponent = false;
  if (typeof nodeName === "function") {
    isComponent = true;
    if (shallow) {
      nodeName = getComponentName(nodeName);
    }
  }

  const hasAttributes = attributes !== undefined;
  const isVoid =
    (typeof nodeName === "string" && VOID_ELEMENTS.includes(nodeName)) ||
    (isComponent && children.length === 0);

  renderer.onOpenTag(
    nodeName as string,
    Boolean(vnode.children || vnode.attributes.chidren),
    isVoid,
    depth,
  );

  if (hasAttributes) {
    let keys = Object.keys(attributes);
    if (sort) {
      keys = keys.sort();
    }

    for (let name of keys) {
      let value = attributes[name];

      if (value === true || value === false) {
        renderer.onProp(name, value, depth);
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
        renderer.onProp(name, value.__html, depth);
      } else {
        renderer.onProp(name, encode(value), depth);
      }
    }
  }

  renderer.onOpenTagClose(
    nodeName as string,
    hasAttributes,
    isVoid,
    children !== undefined && children.length > 0,
    depth,
  );

  if (children !== undefined) {
    for (const child of children) {
      options.depth += 1;
      walk(child, renderer, options);
    }
  }

  renderer.onCloseTag(nodeName as string, isVoid, depth);
}
