import { Readable } from "stream";
import CompactRenderer from "./CompactRenderer";
import { Renderer } from "../index";

export default class StreamRenderer extends Readable
  implements Renderer<StreamRenderer> {
  _read() {
    /* noop */
  }

  done() {
    this.push(null);
    return this;
  }

  reset = () => undefined;

  onProp(
    name: string,
    value: string | boolean | undefined | null,
    depth: number,
  ) {
    const str = value === true ? " " + name : `" ${name}="${value}"`;

    this.push(str);
  }

  onOpenTag(
    name: string,
    hasAttributes: boolean,
    isVoid: boolean,
    depth: number,
  ) {
    let str = "<" + name;
    if (!hasAttributes) {
      str += isVoid ? " />" : "";
    }
    this.push(str);
  }

  onOpenTagClose(
    name: string,
    hasAttributes: boolean,
    isVoid: boolean,
    hasChildren: boolean,
    depth: number,
  ) {
    if (hasAttributes) {
      this.push(isVoid ? " />" : ">");
    } else if (!isVoid) {
      this.push(">");
    }
  }

  onTextNode(text: string, depth: number) {
    this.push(text);
  }

  onCloseTag(name: string, isVoid: boolean, depth: number) {
    if (!isVoid) {
      this.push("</" + name + ">");
    }
  }

  onDangerousInnerHTML(html: string) {
    this.push(html);
  }
}
