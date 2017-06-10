import { h } from "preact";
import { assert as t } from "chai";
import { render } from "../renderSync";
import JsxRenderer from "../JsxRenderer";

const renderer = new JsxRenderer();

describe("JsxRenderer", () => {
  it("should render self-closing elements", () => {
    const res = render(<meta accept="foo" />, renderer);
    t.equal(res, '<meta\n  accept="foo"\n/>\n');
  });

  it("should render div", () => {
    const res = render(<div />, renderer);
    t.equal(res, "<div></div>\n");
  });

  it("should render text children", () => {
    const res = render(<div>foo</div>, renderer);
    t.equal(res, "<div>\n  foo\n</div>\n");
  });

  it("should render nested elements", () => {
    const res = render(
      <div>
        <div><p>foo</p></div>
      </div>,
      renderer,
    );
    t.equal(
      res,
      "<div>\n  <div>\n    <p>\n      foo\n    </p>\n  </div>\n</div>\n",
    );
  });

  it("should render components", () => {
    const Foo = () => <div>foo</div>;
    const res = render(<div><Foo /></div>, renderer);
    t.equal(res, "<div>\n  <div>\n    foo\n  </div>\n</div>\n");
  });

  it("should shallow render components", () => {
    const Foo = () => <div>foo</div>;
    const res = render(<div><Foo /></div>, renderer, { shallow: true });
    t.equal(res, "<div>\n  <Foo />\n</div>\n");
  });
});
