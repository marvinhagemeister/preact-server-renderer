import { h } from "preact";
import { assert as t } from "chai";
import { render } from "../renderSync";
import JsxRenderer from "../JsxRenderer";
import { renderHelper } from "./StubRenderer";

describe("JsxRenderer", () => {
  const renderer = new JsxRenderer();
  const r = renderHelper(renderer);

  it("should render self-closing elements", () => {
    const res = r(<meta accept="foo" />);
    t.equal(res, '<meta\n  accept="foo"\n/>\n');
  });

  it("should render div", () => {
    const res = r(<div />);
    t.equal(res, "<div></div>\n");
  });

  it("should render text children", () => {
    const res = r(<div>foo</div>);
    t.equal(res, "<div>\n  foo\n</div>\n");
  });

  it("should render nested elements", () => {
    const res = r(
      <div>
        <div><p>foo</p></div>
      </div>,
    );
    t.equal(
      res,
      "<div>\n  <div>\n    <p>\n      foo\n    </p>\n  </div>\n</div>\n",
    );
  });

  it("should render components", () => {
    const Foo = () => <div>foo</div>;
    const res = r(<div><Foo /></div>);
    t.equal(res, "<div>\n  <div>\n    foo\n  </div>\n</div>\n");
  });

  it("should shallow render components", () => {
    const Foo = () => <div>foo</div>;
    const res = render(<div><Foo /></div>, renderer, { shallow: true });
    t.equal(res, "<div>\n  <Foo />\n</div>\n");
  });

  it("should shallow render components with attributes", () => {
    const Foo = (props: { a: string }) => <div>foo {props.a}</div>;
    const res = render(<div><Foo a="bar" /></div>, renderer, { shallow: true });
    t.equal(res, '<div>\n  <Foo\n    a="bar"\n  />\n</div>\n');
  });
});
