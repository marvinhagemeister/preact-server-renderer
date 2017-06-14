import * as sinon from "sinon";
import { createRenderer, Renderer, Options } from "../renderSync";

export default class StubRenderer implements Renderer {
  output: string = "";
  onProp = sinon.spy();
  onOpenTag = sinon.spy();
  onOpenTagClose = sinon.spy();
  onTextNode = sinon.spy();
  onCloseTag = sinon.spy();
  onDangerousInnerHTML = sinon.spy();

  reset() {
    this.onCloseTag.reset();
    this.onOpenTag.reset();
    this.onProp.reset();
  }
}
