import { padStart } from "vdom-utils";
import { Renderer } from "./Renderer";

export interface Options {
  indent: number;
}

export default class JsxRenderer implements Renderer {
  indent: number;

  constructor(options: Partial<Options> = {}) {
    const defaultOpts: Options = { indent: 2 };
    Object.assign(this, defaultOpts, options);
  }

  onProp(name: string, value: string, depth: number): string {
    const indent = (depth + 1) * this.indent;
    return "\n" + padStart(name + '="' + value + '"', indent);
  }

  onOpenTag(
    name: string,
    hasAttributes: boolean,
    isVoid: boolean,
    depth: number,
  ): string {
    let data = padStart("<" + name, depth * this.indent);
    if (!hasAttributes) {
      data += isVoid ? " />\n" : "";
    }

    return data;
  }

  onOpenTagClose(
    name: string,
    hasAttributes: boolean,
    isVoid: boolean,
    hasChildren: boolean,
    depth: number,
  ): string {
    let data = "";
    if (hasAttributes) {
      data += isVoid ? "\n" + padStart("/>\n", depth * this.indent) : "\n";
    } else if (!isVoid) {
      data += ">";
    }

    if (hasChildren) {
      data += "\n";
    }

    return data;
  }

  onTextNode(text: string, depth: number): string {
    return padStart(text + "\n", depth * this.indent);
  }

  onCloseTag(name: string, isVoid: boolean, depth: number): string {
    if (!isVoid) {
      return padStart("</" + name + ">", depth * this.indent) + "\n";
    }

    return "";
  }
}
