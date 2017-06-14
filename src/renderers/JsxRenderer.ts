import { padStart } from "vdom-utils";
import { Renderer } from "../renderSync";

export interface Options {
  indent: number;
}

export default class JsxRenderer implements Renderer {
  indent: number;
  output: string = "";

  constructor(options: Partial<Options> = {}) {
    const defaultOpts: Options = { indent: 2 };
    Object.assign(this, defaultOpts, options);
  }

  reset() {
    this.output = "";
  }

  onProp(name: string, value: string, depth: number) {
    const indent = (depth + 1) * this.indent;
    this.output += "\n" + padStart(name + '="' + value + '"', indent);
  }

  onOpenTag(
    name: string,
    hasAttributes: boolean,
    isVoid: boolean,
    depth: number,
  ) {
    this.output += padStart("<" + name, depth * this.indent);
    if (!hasAttributes) {
      this.output += isVoid ? " />\n" : "";
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
      const closer = isVoid ? "/>\n" : ">";
      this.output += "\n" + padStart(closer, depth * this.indent);
    } else if (!isVoid) {
      this.output += ">";
    }

    if (hasChildren) {
      this.output += "\n";
    }
  }

  onTextNode(text: string, depth: number) {
    this.output += padStart(text + "\n", depth * this.indent);
  }

  onCloseTag(name: string, isVoid: boolean, depth: number) {
    if (!isVoid) {
      this.output += padStart("</" + name + ">", depth * this.indent) + "\n";
    }
  }

  onDangerousInnerHTML(html: string) {
    this.output += html;
  }
}
