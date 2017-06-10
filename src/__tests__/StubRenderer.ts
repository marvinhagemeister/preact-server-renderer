import * as sinon from "sinon";
import { Renderer } from "../Parser";

export default class StubRenderer implements Renderer {
  cb: any;

  constructor(cb: any) {
    this.cb = cb;
  }

  onProp = sinon.spy();
  onOpenTag = sinon.spy();
  onOpenTagClose = sinon.spy();
  onTextNode = sinon.spy();
  onCloseTag = sinon.spy();

  onDone() {
    this.cb();
  }

  reset() {
    this.onCloseTag.reset();
    this.onOpenTag.reset();
    this.onProp.reset();
  }
}
