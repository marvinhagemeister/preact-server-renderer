import { h, VNode } from "preact";
import * as fs from "fs";
import * as path from "path";
import { assert as t } from "chai";
import { createRenderer } from "../../renderSync";
import JsxRenderer from "../JsxRenderer";

describe("JsxRenderer", () => {
  const renderer = new JsxRenderer();
  const r = createRenderer<string, JsxRenderer>(renderer);

  beforeEach(() => renderer.reset());

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
        <div>
          <p>foo</p>
        </div>
      </div>,
    );
    t.equal(
      res,
      "<div>\n  <div>\n    <p>\n      foo\n    </p>\n  </div>\n</div>\n",
    );

    const res2 = r(
      <div>
        <h1>Hello World!</h1>
        content
      </div>,
    );

    t.equal(
      res2,
      "<div>\n  <h1>\n    Hello World!\n  </h1>\n  content\n</div>\n",
    );
  });

  it("should serialize object styles", () => {
    const res = r(<div style={{ color: "red", border: "none" }} />);
    t.equal(res, '<div\n  style="color: red; border: none;"\n></div>\n');

    const res2 = r(<div style={{}} />);
    t.equal(res2, '<div\n  style=""\n></div>\n');
  });

  it("should render components", () => {
    const Foo = () => <div>foo</div>;
    const res = r(
      <div>
        <Foo />
      </div>,
    );
    t.equal(res, "<div>\n  <div>\n    foo\n  </div>\n</div>\n");
  });

  it("should shallow render components", () => {
    const Foo = () => <div>foo</div>;
    const res = createRenderer(new JsxRenderer(), { shallow: true })(
      <div>
        <Foo />
      </div>,
    );
    t.equal(res, "<div>\n  <Foo />\n</div>\n");
  });

  it("should shallow render components with attributes", () => {
    const Foo = (props: { a: string }) =>
      <div>
        foo {props.a}
      </div>;
    const res = createRenderer(new JsxRenderer(), { shallow: true })(
      <div>
        <Foo a="bar" />
      </div>,
    );
    t.equal(res, '<div>\n  <Foo\n    a="bar"\n  />\n</div>\n');
  });

  it("should render svg correctly", () => {
    const svg = (
      <svg width="1000" height="1000" xmlns="http://www.w3.org/2000/svg">
        <symbol viewBox="0 0 100 100" id="input">
          <g>
            <title>Layer 1</title>
            <ellipse
              ry="21"
              rx="19"
              id="svg_1"
              cy="30"
              cx="29"
              stroke-width="5"
              stroke="#000000"
              fill="#FF0000"
            />
            <polygon
              stroke-width="5"
              stroke="#000000"
              points="88.53213119506836,60 69.50789642333984,86.18461608886719 38.72603702545166"
              strokeWidth="5"
              fill="#FF0000"
              orient="x"
              shape="regularPoly"
              id="svg_2"
              cy="75"
              cx="35"
            />
          </g>
        </symbol>
      </svg>
    );

    t.deepEqual(
      r(svg),
      fs.readFileSync(path.join(__dirname, "fixtures", "svg.txt"), "utf8"),
    );
  });
});
