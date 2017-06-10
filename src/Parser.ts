import { VNode } from "preact";
import { escapeAttr as encode, VOID_ELEMENTS, padStart } from "vdom-utils";
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
  onDone(html: string): void;
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
  renderer.onDone("");
}

export function walk(
  vnode: VNode | string | undefined,
  renderer: Renderer,
  options: Options,
) {
  // Text node
  if (typeof vnode === "string") {
    renderer.onTextNode(vnode, options.depth);
    return;
  }

  const { depth, shallow, sort } = options;
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
    VOID_ELEMENTS.indexOf(nodeName as string) > -1 ||
    (isComponent && children.length === 0);

  if (hasAttributes && vnode.attributes.children !== undefined) {
    children = vnode.attributes.children;
  }

  renderer.onOpenTag(
    nodeName as string,
    hasAttributes && children.length > 0,
    isVoid,
    depth,
  );

  if (hasAttributes) {
    let keys = Object.keys(attributes);
    if (sort) {
      keys = keys.sort();
    }

    const keyLen = keys.length;
    for (var i = 0; i < keyLen; i++) {
      let name = keys[i];
      let value = attributes[name];

      if (name === "className") {
        if (attributes.class !== undefined) {
          continue;
        }
        name = "class";
      } else if (name === "style") {
        value = "STYLE";
      } else if (name === "children") {
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

  const childrenLen = children.length;
  if (childrenLen > 0) {
    for (var j = 0; j < childrenLen; j++) {
      options.depth += 1;
      walk(children[j], renderer, options);
    }
  }

  renderer.onCloseTag(nodeName as string, isVoid, depth);
}
