export interface Renderer {
  onProp(name: string, value: string, depth: number): string;
  onOpenTag(
    name: string,
    hasChildren: boolean,
    isVoid: boolean,
    depth: number,
  ): string;
  onOpenTagClose(
    name: string,
    hasAttributes: boolean,
    isVoid: boolean,
    hasChildren: boolean,
    depth: number,
  ): string;
  onTextNode(text: string, depth: number): string;
  onCloseTag(name: string, isVoid: boolean, depth: number): string;
}
