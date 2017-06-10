import { padStart } from "vdom-utils";
import { Renderer } from "./Parser";

const tabSize = 2;

export default class JsxRenderer implements Renderer {
  html: string = "";
  cb: (html: string) => any;

  constructor(cb: (html: string) => any) {
    this.cb = cb;
  }

  onProp(name: string, value: string, depth: number) {
    this.html += "\n" + padStart(`${name}="${value}"`, (depth + 1) * tabSize);
  }

  onOpenTag(
    name: string,
    hasChildren: boolean,
    isVoid: boolean,
    depth: number,
  ) {
    this.html += padStart("<" + name, depth * tabSize);
    if (!hasChildren) {
      this.html += isVoid ? "\n" : "/>\n";
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
      this.html += "\n";
    }

    this.html += isVoid ? "/>\n" : ">";

    if (hasChildren) {
      this.html += "\n";
    }
  }

  onTextNode(text: string, depth: number) {
    this.html += padStart(text + "\n", depth * tabSize);
  }

  onCloseTag(name: string, isVoid: boolean, depth: number) {
    if (!isVoid) {
      this.html += padStart("</" + name + ">", depth * tabSize) + "\n";
    }
  }

  onDone() {
    this.cb(this.html);
  }
}
