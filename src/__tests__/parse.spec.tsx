import { h } from "preact";
import { assert as t } from "chai";
import { render } from "../renderSync";
import StubRenderer from "./StubRenderer";

describe("parse", () => {
  it("should swap className with class", () => {
    const stub = new StubRenderer();
    render(<div className="foo" />, stub);

    t.deepEqual(stub.onOpenTag.args[0], ["div", true, false, 0]);
    t.equal(stub.onProp.callCount, 1);
    t.deepEqual(stub.onProp.args[0], ["class", "foo", 0]);
  });

  it("should parse dangerouslySetInnerHTML", () => {
    const html = {
      __html: "<p>Hello</p>",
    };

    const stub = new StubRenderer();
    render(<div dangerouslySetInnerHTML={html as any} />, stub);

    t.equal(stub.onProp.callCount, 1);
    t.deepEqual(stub.onProp.args[0], [
      "dangerouslySetInnerHTML",
      html.__html,
      0,
    ]);
  });

  it("should parse boolean props", () => {
    const stub = new StubRenderer();
    render(<input disabled />, stub);

    t.deepEqual(stub.onOpenTag.args[0], ["input", true, true, 0]);
    t.equal(stub.onProp.callCount, 1);
    t.deepEqual(stub.onProp.args[0], ["disabled", true, 0]);
  });

  it.skip("should convert style object to string", done => {
    const stub = new StubRenderer();
    render(<div style={{ color: "red" }} />, stub);

    t.equal(stub.onProp.callCount, 1);
    t.deepEqual(stub.onProp.args[0], ["style", "color: red;", 0]);
  });

  it("should skip undefined nodes", () => {
    const stub = new StubRenderer();
    render(undefined as any, stub);

    t.equal(stub.onOpenTag.callCount, 0);
    t.equal(stub.onCloseTag.callCount, 0);
    t.equal(stub.onProp.callCount, 0);
  });
});
