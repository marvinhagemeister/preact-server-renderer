import { VNode } from "preact";
import {
  escapeAttr as encode,
  VOID_ELEMENTS,
  padStart,
  jsToCss,
} from "vdom-utils";
import { getComponentName, getNodeProps } from "./utils";

export interface Renderer {
  html: string;
  /** Reset the current instance */
  reset(): void;
  /** Called when an attribute is parsed */
  onProp(
    name: string,
    value: string | boolean | undefined | null,
    depth: number,
  ): void;
  /** Called at the start of each new vnode object */
  onOpenTag(
    name: string,
    hasChildren: boolean,
    isVoid: boolean,
    depth: number,
  ): void;
  /** Called when attribute parsing is done for the current vnode */
  onOpenTagClose(
    name: string,
    hasAttributes: boolean,
    isVoid: boolean,
    hasChildren: boolean,
    depth: number,
  ): void;
  /** Called when the node is a simple string */
  onTextNode(text: string, depth: number): void;
  /** Called when all children of the current vnode are parsed */
  onCloseTag(name: string, isVoid: boolean, depth: number): void;
  /** Called when vnode has it's own html (f.ex. jQuery plugins) */
  onDangerousInnerHTML(html: string): void;
}

export interface Options {
  sort: boolean;
  shallow: boolean;
  depth: number;
}

const defaultOpts: Options = {
  sort: false,
  shallow: false,
  depth: 0,
};

export const createRenderer = (
  renderer: Renderer,
  options: Partial<Options> = {},
) => {
  const opts = {
    ...defaultOpts,
    ...options,
  };

  if (opts.depth === undefined) {
    opts.depth = defaultOpts.depth;
  }

  return (vnode: VNode) => {
    renderer.reset();
    renderToString(vnode, renderer, opts.depth, opts as Options);
    return renderer.html;
  };
};

export function renderToString(
  vnode: VNode | string | undefined,
  renderer: Renderer,
  depth: number,
  options: Options,
): void {
  if (vnode === undefined) {
    return;
  }

  // Text node
  if (typeof vnode === "string") {
    renderer.onTextNode(encode(vnode), depth);
    return;
  }

  const { shallow, sort } = options;
  const { attributes } = vnode;
  let { nodeName, children } = vnode;

  // Component
  if (typeof nodeName === "function") {
    if (shallow) {
      nodeName = getComponentName(nodeName);
    } else {
      // Stateless
      let rendered;
      const props = getNodeProps(vnode);

      if (
        !nodeName.prototype ||
        typeof nodeName.prototype.render !== "function"
      ) {
        rendered = (nodeName as any)(props, undefined);
      } else {
        // Class components
        const c = new nodeName(props, undefined);

        if ((c as any).componentWillMount !== undefined) {
          (c as any).componentWillMount();
        }
        rendered = c.render(props, undefined);
      }
      renderToString(rendered, renderer, depth, options);
      return;
    }
  }

  const hasAttributes = attributes !== undefined;
  if (hasAttributes && vnode.attributes.children !== undefined) {
    children = vnode.attributes.children;
  }

  const isVoid =
    VOID_ELEMENTS.includes(nodeName as string) ||
    (shallow && children.length === 0);

  renderer.onOpenTag(nodeName as string, hasAttributes, isVoid, depth);

  let dangerHtml: string | undefined;
  if (hasAttributes) {
    let keys = Object.keys(attributes);
    if (sort) {
      keys = keys.sort();
    }

    const keyLen = keys.length;
    for (var i = 0; i < keyLen; i++) {
      let name = keys[i];
      let value = attributes[name];

      if (
        value === undefined ||
        value === null ||
        value === false ||
        name === "children" ||
        name === "key" ||
        name === "ref" ||
        typeof value === "function"
      ) {
        continue;
      } else if (name === "className") {
        if (attributes.class !== undefined) {
          continue;
        }
        name = "class";
      } else if (name === "style") {
        let styles = "";
        const props = Object.keys(value);
        const styleLen = props.length;
        for (var k = 0; k < styleLen; k++) {
          const prop = props[k];
          styles +=
            encode(jsToCss(prop)) + ": " + encode("" + value[prop]) + ";";
          if (k !== styleLen - 1) {
            styles += " ";
          }
        }
        value = styles;
      } else if (name === "dangerouslySetInnerHTML") {
        dangerHtml = value.__html;
        continue;
      }

      if (name.startsWith("xlink")) {
        name = name.toLowerCase().replace(/^xlink\:?(.+)/, "xlink:$1");
      }

      if (typeof value === "string") {
        value = encode(value);
      }

      renderer.onProp(name, value, depth);
    }
  }

  renderer.onOpenTagClose(
    nodeName as string,
    hasAttributes,
    isVoid,
    children.length > 0,
    depth,
  );

  if (dangerHtml !== undefined) {
    renderer.onDangerousInnerHTML(dangerHtml);
  } else {
    const childrenLen = children.length;
    if (childrenLen > 0) {
      for (var j = 0; j < childrenLen; j++) {
        renderToString(children[j], renderer, depth + 1, options);
      }
    }
  }

  renderer.onCloseTag(nodeName as string, isVoid, depth);
}
