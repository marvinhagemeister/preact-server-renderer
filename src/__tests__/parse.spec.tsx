import { h } from "preact";
import { assert as t } from "chai";
import { parse } from "../Parser";
import StubRenderer from "./StubRenderer";

describe.only("parse", () => {
  it("should swap className with class", done => {
    const stub = new StubRenderer(() => {
      t.deepEqual(stub.onOpenTag.args[0], ["div"]);
      t.equal(stub.onProp.callCount, 1);
      t.deepEqual(stub.onProp.args[0], ["class", "foo"]);
      done();
    });
    parse(<div className="foo" />, stub);
  });

  it("should parse dangerouslySetInnerHTML", done => {
    const html = {
      __html: "<p>Hello</p>",
    };

    const stub = new StubRenderer(() => {
      t.equal(stub.onProp.callCount, 1);
      t.deepEqual(stub.onProp.args[0], [
        "dangerouslySetInnerHTML",
        html.__html,
      ]);
      done();
    });

    parse(<div dangerouslySetInnerHTML={html as any} />, stub);
  });

  it("should parse boolean props", done => {
    const stub = new StubRenderer(() => {
      t.deepEqual(stub.onOpenTag.args[0], ["input"]);
      t.equal(stub.onProp.callCount, 1);
      t.deepEqual(stub.onProp.args[0], ["disabled", true]);
      done();
    });

    parse(<input disabled />, stub);
  });

  it.skip("should convert style object to string", done => {
    const stub = new StubRenderer(() => {
      t.equal(stub.onProp.callCount, 1);
      t.deepEqual(stub.onProp.args[0], ["style", "color: red;"]);
      done();
    });

    parse(<div style={{ color: "red" }} />, stub);
  });

  it("should skip undefined nodes", done => {
    const stub = new StubRenderer(() => {
      t.equal(stub.onOpenTag.callCount, 0);
      t.equal(stub.onCloseTag.callCount, 0);
      t.equal(stub.onProp.callCount, 0);
      done();
    });

    parse(undefined, stub);
  });

  it("should skip null nodes", done => {
    const stub = new StubRenderer(() => {
      t.equal(stub.onOpenTag.callCount, 0);
      t.equal(stub.onCloseTag.callCount, 0);
      t.equal(stub.onProp.callCount, 0);
      done();
    });

    parse(null, stub);
  });

  it("should skip boolean nodes", done => {
    const stub = new StubRenderer(() => {
      t.equal(stub.onOpenTag.callCount, 0);
      t.equal(stub.onCloseTag.callCount, 0);
      t.equal(stub.onProp.callCount, 0);
      done();
    });

    parse(true as any, stub);
  });
});
