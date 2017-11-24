import { createRenderer, Renderer, Options } from "../renderSync";

export default class StubRenderer implements Renderer<string> {
  output: string = "";
  onProp = jest.fn();
  onOpenTag = jest.fn();
  onOpenTagClose = jest.fn();
  onTextNode = jest.fn();
  onCloseTag = jest.fn();
  onDangerousInnerHTML = jest.fn();

  reset() {
    this.onCloseTag.mockReset();
    this.onOpenTag.mockReset();
    this.onProp.mockReset();
  }
}
