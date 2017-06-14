import { h } from "preact";
import { assert as t } from "chai";
import { createRenderer, Renderer } from "../renderSync";
import StubRenderer from "./StubRenderer";

const stub = new StubRenderer();
const render = createRenderer(stub);

describe("renderSync", () => {
  it("should swap className with class", () => {
    render(<div className="foo" />);

    t.deepEqual(stub.onOpenTag.args[0], ["div", true, false, 0]);
    t.equal(stub.onProp.callCount, 1);
    t.deepEqual(stub.onProp.args[0], ["class", "foo", 0]);
  });

  it("should parse dangerouslySetInnerHTML", () => {
    const html = {
      __html: "<p>Hello</p>",
    };

    render(<div dangerouslySetInnerHTML={html as any} />);

    t.equal(stub.onProp.callCount, 0);
  });

  it("should parse boolean props", () => {
    render(<input disabled />);

    t.deepEqual(stub.onOpenTag.args[0], ["input", true, true, 0]);
    t.equal(stub.onProp.callCount, 1);
    t.deepEqual(stub.onProp.args[0], ["disabled", true, 0]);
  });

  it("should convert style object to string", () => {
    render(<div style={{ color: "red" }} />);

    t.equal(stub.onProp.callCount, 1);
    t.deepEqual(stub.onProp.args[0], ["style", "color: red;", 0]);
  });

  it("should skip undefined nodes", () => {
    render(undefined as any);

    t.equal(stub.onOpenTag.callCount, 0);
    t.equal(stub.onCloseTag.callCount, 0);
    t.equal(stub.onProp.callCount, 0);
  });
});
