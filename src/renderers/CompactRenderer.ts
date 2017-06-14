import { padStart } from "vdom-utils";
import { Renderer } from "../renderSync";

export default class CompactRenderer implements Renderer {
  output: string = "";

  onProp(
    name: string,
    value: string | boolean | undefined | null,
    depth: number,
  ) {
    if (value === true) {
      this.output += " " + name;
      return;
    }

    this.output += " " + name + '="' + value + '"';
  }

  reset() {
    this.output = "";
  }

  onOpenTag(
    name: string,
    hasAttributes: boolean,
    isVoid: boolean,
    depth: number,
  ) {
    this.output += "<" + name;
    if (!hasAttributes) {
      this.output += isVoid ? " />" : "";
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
      this.output += isVoid ? " />" : ">";
    } else if (!isVoid) {
      this.output += ">";
    }
  }

  onTextNode(text: string, depth: number) {
    this.output += text;
  }

  onCloseTag(name: string, isVoid: boolean, depth: number) {
    if (!isVoid) {
      this.output += "</" + name + ">";
    }
  }

  onDangerousInnerHTML(html: string) {
    this.output += html;
  }
}
