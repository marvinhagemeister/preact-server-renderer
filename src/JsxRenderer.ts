import { padStart } from "vdom-utils";
import { Renderer } from "./Parser";

export default class JsxRenderer implements Renderer {
  indent: number = 0;
  html: string = "";
  hasAttrs: boolean = false;
  cb: (html: string) => any;

  constructor(cb: (html: string) => any) {
    this.cb = cb;
  }

  onProp(name: string, value: string) {
    this.html += "\n" + padStart(name + "=" + value, this.indent + 1);
  }

  onOpenTag(name: string) {
    this.html += padStart("<" + name, this.indent);
  }

  onCloseTag(name: string) {
    if (!this.hasAttrs) {
      this.html += name + "\n";
    } else {
      this.html += padStart(name, this.indent) + "\n";
    }
  }

  onDone() {
    this.cb(this.html);
  }
}
