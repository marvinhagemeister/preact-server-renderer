import { VNode } from "preact";
import { createVNode, encode, getComponentName, VOID_ELEMENTS } from "./utils";

export interface Options {
  shallow: boolean;
  sort: boolean;
  mode: "compact" | "html" | "jsx";
}

const defaultOpts: Options = {
  shallow: false,
  sort: false,
  mode: "compact",
};

export function renderToString(
  vnode: VNode | null | false,
  options: Partial<Options> = defaultOpts,
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
  if (typeof nodeName === "function") {
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
        attrs += name;
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
    typeof nodeName === "string" && VOID_ELEMENTS.includes(nodeName);
  const closeTag = isVoid ? "/>" : ">";

  html += "<" + nodeName;
  const hasAttrs = attrs.length > 0;
  html += hasAttrs ? " " + attrs + closeTag : closeTag;

  if (children !== undefined) {
    for (const child of children) {
      html += renderToString(child, options);
    }
  }

  if (!isVoid) {
    html += "</" + nodeName + ">";
  }
  return html;
}
