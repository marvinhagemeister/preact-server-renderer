import { h } from "preact";
import { assert as t } from "chai";
import { render } from "../renderSync";
import CompactRenderer from "../CompactRenderer";

const renderer = new CompactRenderer();

describe("CompactRenderer", () => {
  it("should render self-closing elements", () => {
    const res = render(<meta accept="foo" />, renderer);
    t.equal(res, '<meta accept="foo" />');
  });

  it("should render div", () => {
    const res = render(<div />, renderer);
    t.equal(res, "<div></div>");
  });

  it("should render text children", () => {
    const res = render(<div>foo</div>, renderer);
    t.equal(res, "<div>foo</div>");
  });

  it("should render nested elements", () => {
    const res = render(
      <div>
        <div><p>foo</p></div>
      </div>,
      renderer,
    );
    t.equal(res, "<div><div><p>foo</p></div></div>");
  });

  it("should render components", () => {
    const Foo = () => <div>foo</div>;
    const res = render(<div><Foo /></div>, renderer);
    t.equal(res, "<div><div>foo</div></div>");
  });

  it("should shallow render components", () => {
    const Foo = () => <div>foo</div>;
    const res = render(<div><Foo /></div>, renderer, { shallow: true });
    t.equal(res, "<div><Foo /></div>");
  });

  it("should shallow render components with attributes", () => {
    const Foo = (props: { a: string }) => <div>foo {props.a}</div>;
    const res = render(<div><Foo a="bar" /></div>, renderer, { shallow: true });
    t.equal(res, '<div><Foo a="bar" /></div>');
  });
});
