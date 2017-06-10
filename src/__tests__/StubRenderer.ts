import * as sinon from "sinon";
import { Renderer } from "../Renderer";

export default class StubRenderer implements Renderer {
  onProp = sinon.spy();
  onOpenTag = sinon.spy();
  onOpenTagClose = sinon.spy();
  onTextNode = sinon.spy();
  onCloseTag = sinon.spy();

  reset() {
    this.onCloseTag.reset();
    this.onOpenTag.reset();
    this.onProp.reset();
  }
}
