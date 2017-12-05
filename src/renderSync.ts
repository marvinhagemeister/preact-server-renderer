import { VNode } from "preact";
import { escape, VOID_ELEMENTS, padStart, jsToCss } from "vdom-utils";
import { getComponentName, getNodeProps } from "./utils";
import { React } from "./index";

export interface Renderer<T> {
  /** Will be returned when rendering is completed */
  output: T;
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

export const createRenderer = <T, R extends Renderer<T>>(
  renderer: R,
  options: Partial<Options> = {},
) => {
  const opts = {
    ...defaultOpts,
    ...options,
  };

  if (opts.depth === undefined) {
    opts.depth = defaultOpts.depth;
  }

  return (vnode: VNode): T => {
    renderer.reset();
    walkTree(vnode, renderer, opts.depth as number, opts as Options);
    return renderer.output;
  };
};

export function walkTree<T, R extends Renderer<T>>(
  vnode: VNode | string | undefined,
  renderer: R,
  depth: number,
  options: Options,
): void {
  if (vnode === undefined) {
    return;
  }

  // Text node
  if (typeof vnode === "string") {
    renderer.onTextNode(escape(vnode), depth);
    return;
  }

  const { shallow, sort } = options;
  const { attributes } = vnode;
  let { nodeName, children } = vnode;

  // Preview Support for Fragments
  const skip = (nodeName as any) === React.Fragment;

  let isVoid = false;
  let dangerHtml: string | undefined;
  if (!skip) {
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
        walkTree(rendered, renderer, depth, options);
        return;
      }
    }

    const hasAttributes = attributes !== undefined;
    if (hasAttributes && vnode.attributes.children !== undefined) {
      children = vnode.attributes.children;
    }

    isVoid =
      VOID_ELEMENTS.has(nodeName as string) ||
      (shallow && children.length === 0);

    renderer.onOpenTag(nodeName as string, hasAttributes, isVoid, depth);

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
              escape(jsToCss(prop)) + ": " + escape("" + value[prop]) + ";";
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
          value = escape(value);
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
  }

  if (!skip && dangerHtml !== undefined) {
    renderer.onDangerousInnerHTML(dangerHtml);
  } else {
    const childrenLen = children.length;
    if (childrenLen > 0) {
      for (var j = 0; j < childrenLen; j++) {
        walkTree(children[j], renderer, depth + 1, options);
      }
    }
  }

  if (!skip) {
    renderer.onCloseTag(nodeName as string, isVoid, depth);
  }
}
