import { VNode } from "preact";
import { VOID_ELEMENTS, padStart } from "vdom-utils";
import { createVNode, encode, getComponentName } from "./utils";

export interface Options {
  shallow: boolean;
  sort: boolean;
  mode: "compact" | "html" | "jsx";
  indentLevel: number;
}

const defaultOpts: Options = {
  shallow: false,
  sort: false,
  mode: "compact",
  indentLevel: 0,
};

export default function render(vnode: VNode, options: Partial<Options>) {
  return renderToString(vnode, {
    ...defaultOpts,
    ...options,
  });
}

export function renderToString(
  vnode: VNode | null | false,
  options: Options,
): string {
  if (vnode === null || vnode === false) {
    return "";
  }

  const attributes = vnode.attributes;
  let { nodeName, children } = vnode;

  // Text node
  if (nodeName === undefined) {
    return encode(vnode);
  }

  let html = "";
  // Component
  let isComponent = false;
  if (typeof nodeName === "function") {
    isComponent = true;
    if (options.shallow) {
      nodeName = getComponentName(nodeName);
    }
  }

  let attrs = "";
  if (attributes !== undefined) {
    let keys = Object.keys(attributes);
    if (options.sort) {
      keys = keys.sort();
    }

    for (let name of keys) {
      let value = attributes[name];

      if (value === true || value === false) {
        if (options.mode === "jsx") {
          attrs += padStart(name, options.indentLevel);
        } else {
          attrs += name;
        }
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
        attrs += value.__html;
        continue;
      } else {
        if (options.mode === "jsx") {
          attrs += padStart("", options.indentLevel);
        }
        // TODO: Prevent xss
        if (value === true || value === false) {
          attrs += name;
        } else {
          attrs += name + '="' + encode(value) + '"';
        }

        if (options.mode === "html") {
          attrs += " ";
        } else if (options.mode === "jsx") {
          attrs += "\n";
        }
      }
    }
  }

  const isVoid =
    (typeof nodeName === "string" && VOID_ELEMENTS.includes(nodeName)) ||
    (isComponent && children.length === 0);
  const closeTag = isVoid ? "/>" : ">";

  html += "<" + nodeName;
  const hasAttrs = attrs.length > 0;

  if (options.mode === "jsx") {
    if (hasAttrs) {
      html += "\n" + attrs + closeTag + "\n";
    } else {
      html += closeTag + "\n";
    }
  } else {
    html += hasAttrs ? " " + attrs + closeTag : closeTag;
  }

  if (children !== undefined) {
    options.indentLevel += 2;
    for (const child of children) {
      html += renderToString(child, options);
    }
  }

  if (!isVoid) {
    if (options.mode === "jsx") {
      html += "\n";
    }
    html += "</" + nodeName + ">";
  }
  return html;
}
