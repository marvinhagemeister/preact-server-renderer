import { padStart } from "vdom-utils";
import { Renderer } from "./Renderer";

export default class CompactRenderer implements Renderer {
  onProp(
    name: string,
    value: string | boolean | undefined | null,
    depth: number,
  ): string {
    if (value === true) {
      return " " + name;
    }

    return " " + name + '="' + value + '"';
  }

  onOpenTag(
    name: string,
    hasAttributes: boolean,
    isVoid: boolean,
    depth: number,
  ): string {
    let data = "<" + name;
    if (!hasAttributes) {
      data += isVoid ? " />" : "";
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
      data += isVoid ? " />" : ">";
    } else if (!isVoid) {
      data += ">";
    }

    return data;
  }

  onTextNode(text: string, depth: number): string {
    return text;
  }

  onCloseTag(name: string, isVoid: boolean, depth: number): string {
    if (!isVoid) {
      return "</" + name + ">";
    }

    return "";
  }
}
