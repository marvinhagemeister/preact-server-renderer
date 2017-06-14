import { padStart } from "vdom-utils";
import { Renderer } from "../renderSync";

export interface Options {
  indent: number;
}

export default class JsxRenderer implements Renderer {
  indent: number;
  html: string = "";

  constructor(options: Partial<Options> = {}) {
    const defaultOpts: Options = { indent: 2 };
    Object.assign(this, defaultOpts, options);
  }

  reset() {
    this.html = "";
  }

  onProp(name: string, value: string, depth: number) {
    const indent = (depth + 1) * this.indent;
    this.html += "\n" + padStart(name + '="' + value + '"', indent);
  }

  onOpenTag(
    name: string,
    hasAttributes: boolean,
    isVoid: boolean,
    depth: number,
  ) {
    this.html += padStart("<" + name, depth * this.indent);
    if (!hasAttributes) {
      this.html += isVoid ? " />\n" : "";
    }
  }

  onOpenTagClose(
    name: string,
    hasAttributes: boolean,
    isVoid: boolean,
    hasChildren: boolean,
    depth: number,
  ) {
    if (hasAttributes) {
      this.html += isVoid ? "\n" + padStart("/>\n", depth * this.indent) : "\n";
    } else if (!isVoid) {
      this.html += ">";
    }

    if (hasChildren) {
      this.html += "\n";
    }
  }

  onTextNode(text: string, depth: number) {
    this.html += padStart(text + "\n", depth * this.indent);
  }

  onCloseTag(name: string, isVoid: boolean, depth: number) {
    if (!isVoid) {
      this.html += padStart("</" + name + ">", depth * this.indent) + "\n";
    }
  }

  onDangerousInnerHTML(html: string) {
    this.html += html;
  }
}
