import { VNode } from "preact";
import { React } from "../../preview";
import { createRenderer } from "../../renderSync";
import JsxRenderer from "../JsxRenderer";

describe("JsxRenderer", () => {
  const renderer = new JsxRenderer();
  const r = createRenderer<string, JsxRenderer>(renderer);

  beforeEach(() => renderer.reset());

  it("should render self-closing elements", () => {
    const res = r(<meta accept="foo" />);
    expect(res).toEqual('<meta\n  accept="foo"\n/>\n');
  });

  it("should render div", () => {
    const res = r(<div />);
    expect(res).toEqual("<div></div>\n");
  });

  it("should render text children", () => {
    const res = r(<div>foo</div>);
    expect(res).toEqual("<div>\n  foo\n</div>\n");
  });

  it("should render nested elements", () => {
    const res = r(
      <div>
        <div>
          <p>foo</p>
        </div>
      </div>,
    );
    expect(res).toEqual(
      "<div>\n  <div>\n    <p>\n      foo\n    </p>\n  </div>\n</div>\n",
    );

    const res2 = r(
      <div>
        <h1>Hello World!</h1>
        content
      </div>,
    );

    expect(res2).toEqual(
      "<div>\n  <h1>\n    Hello World!\n  </h1>\n  content\n</div>\n",
    );
  });

  it("should serialize object styles", () => {
    const res = r(<div style={{ color: "red", border: "none" }} />);
    expect(res).toEqual('<div\n  style="color: red; border: none;"\n></div>\n');

    const res2 = r(<div style={{}} />);
    expect(res2).toEqual('<div\n  style=""\n></div>\n');
  });

  it("should render components", () => {
    const Foo = () => <div>foo</div>;
    const res = r(
      <div>
        <Foo />
      </div>,
    );
    expect(res).toEqual("<div>\n  <div>\n    foo\n  </div>\n</div>\n");
  });

  it("should shallow render components", () => {
    const Foo = () => <div>foo</div>;
    const res = createRenderer(new JsxRenderer(), { shallow: true })(
      <div>
        <Foo />
      </div>,
    );
    expect(res).toEqual("<div>\n  <Foo />\n</div>\n");
  });

  it("should shallow render components with attributes", () => {
    const Foo = (props: { a: string }) => <div>foo {props.a}</div>;
    const res = createRenderer(new JsxRenderer(), { shallow: true })(
      <div>
        <Foo a="bar" />
      </div>,
    );
    expect(res).toEqual('<div>\n  <Foo\n    a="bar"\n  />\n</div>\n');
  });
});
