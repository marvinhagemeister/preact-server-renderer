import { padStart } from "vdom-utils";
import { Renderer } from "./renderSync";

export default class CompactRenderer implements Renderer {
  html: string = "";

  onProp(
    name: string,
    value: string | boolean | undefined | null,
    depth: number,
  ) {
    if (value === true) {
      this.html += " " + name;
      return;
    }

    this.html += " " + name + '="' + value + '"';
  }

  reset() {
    this.html = "";
  }

  onOpenTag(
    name: string,
    hasAttributes: boolean,
    isVoid: boolean,
    depth: number,
  ) {
    this.html += "<" + name;
    if (!hasAttributes) {
      this.html += isVoid ? " />" : "";
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
      this.html += isVoid ? " />" : ">";
    } else if (!isVoid) {
      this.html += ">";
    }
  }

  onTextNode(text: string, depth: number) {
    this.html += text;
  }

  onCloseTag(name: string, isVoid: boolean, depth: number) {
    if (!isVoid) {
      this.html += "</" + name + ">";
    }
  }

  onDangerousInnerHTML(html: string) {
    this.html += html;
  }
}
