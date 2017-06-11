import { VNode } from "preact";
import {
  escapeAttr as encode,
  VOID_ELEMENTS,
  padStart,
  jsToCss,
} from "vdom-utils";
import { getComponentName, getNodeProps } from "./utils";
import { Renderer } from "./Renderer";

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

export function render(
  vnode: VNode,
  renderer: Renderer,
  options: Partial<Options> = {},
) {
  return renderToString(vnode, renderer, {
    ...defaultOpts,
    ...options,
  });
}

export function renderToString(
  vnode: VNode | string | undefined,
  renderer: Renderer,
  options: Options,
): string {
  let html = "";
  if (vnode === undefined) {
    return html;
  }

  // Text node
  if (typeof vnode === "string") {
    return renderer.onTextNode(encode(vnode), options.depth);
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
      return renderToString(rendered, renderer, options);
    }
  }

  const hasAttributes = attributes !== undefined;
  const isVoid =
    VOID_ELEMENTS.indexOf(nodeName as string) > -1 ||
    (isComponent && children.length === 0);

  if (hasAttributes && vnode.attributes.children !== undefined) {
    children = vnode.attributes.children;
  }

  html += renderer.onOpenTag(nodeName as string, hasAttributes, isVoid, depth);

  let dangerHtml;
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
        typeof value === "function"
      ) {
        continue;
      } else if (name === "children") {
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
      }

      if (name === "dangerouslySetInnerHTML") {
        dangerHtml = value.__html;
      } else {
        if (name.startsWith("xlink")) {
          name = name.toLowerCase().replace(/^xlink\:?(.+)/, "xlink:$1");
        }

        if (typeof value === "string") {
          value = encode(value);
        }
        html += renderer.onProp(name, value, depth);
      }
    }
  }

  html += renderer.onOpenTagClose(
    nodeName as string,
    hasAttributes,
    isVoid,
    children.length > 0,
    depth,
  );

  if (dangerHtml !== undefined) {
    html += dangerHtml;
  }

  const childrenLen = children.length;
  if (childrenLen > 0) {
    for (var j = 0; j < childrenLen; j++) {
      options.depth += 1;
      html += renderToString(children[j], renderer, options);
    }
  }

  html += renderer.onCloseTag(nodeName as string, isVoid, depth);
  return html;
}
