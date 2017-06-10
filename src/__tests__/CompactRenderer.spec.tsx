import { h } from "preact";
import { assert as t } from "chai";
import { render } from "../renderSync";
import CompactRenderer from "../CompactRenderer";
import { renderHelper } from "./StubRenderer";

describe("CompactRenderer", () => {
  const renderer = new CompactRenderer();
  const r = renderHelper(renderer);

  it("should render self-closing elements", () => {
    const res = r(<meta accept="foo" />);
    t.equal(res, '<meta accept="foo" />');
  });

  it("should render div", () => {
    const res = r(<div />);
    t.equal(res, "<div></div>");
  });

  it("should render text children", () => {
    const res = r(<div>foo</div>);
    t.equal(res, "<div>foo</div>");
  });

  it("should encode text children", () => {
    const res = r(<div>{"<foo"}</div>);
    t.equal(res, "<div>&lt;foo</div>");
  });

  it("should render nested elements", () => {
    const res = r(
      <div>
        <div><p>foo</p></div>
      </div>,
    );
    t.equal(res, "<div><div><p>foo</p></div></div>");
  });

  it("should render components", () => {
    const Foo = () => <div>foo</div>;
    const res = r(<div><Foo /></div>);
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

  it("should omit newlines in attributes", () => {
    const res = r(
      <div class={`foo\n\tbar\n\tbaz`}>
        <a>a</a>
        <b>b</b>
        c
      </div>,
    );

    t.equal(res, '<div class="foo\n\tbar\n\tbaz"><a>a</a><b>b</b>c</div>');
  });

  it("should escape falsey attributes", () => {
    const res = r(<div data-a={null} data-b={undefined} data-c={false} />);
    t.equal(res, '<div data-a="null" data-b="undefined"></div>');

    t.equal(r(<div data-foo={0} />), '<div data-foo="0"></div>');
  });

  it("should collapse collapsible attributes", () => {
    const res = r(<div class="" style="" data-foo={true} data-bar />);

    t.equal(res, '<div class="" style="" data-foo data-bar></div>');
  });

  it("should encode entities", () => {
    const res = r(<div data-a={'"<>&'}>{'"<>&'}</div>);

    t.equal(res, '<div data-a="&quot;&lt;&gt;&amp;">&quot;&lt;&gt;&amp;</div>');
  });

  it("should omit falsey children", () => {
    const res = r(<div>{null}|{undefined}|{false}</div>);
    t.equal(res, "<div>||</div>");
  });

  it("does not close void elements with closing tags", () => {
    const res = r(<input><p>Hello World</p></input>);
    t.equal(res, "<input /><p>Hello World</p>");
  });

  it("should serialize object styles", () => {
    const res = r(<div style={{ color: "red", border: "none" }} />);
    t.equal(res, '<div style="color: red; border: none;"></div>');

    const res2 = r(<div style={{}} />);
    t.equal(res2, '<div style=""></div>');
  });

  it("should render SVG elements", () => {
    const res = r(
      <div>
        <svg>
          <image xlinkHref="#" />
          <foreignObject>
            <image xlinkHref="#" />
          </foreignObject>
          <g>
            <image xlinkHref="#" />
          </g>
        </svg>
      </div>,
    );

    t.equal(
      res,
      '<div><svg><image xlink:href="#"></image><foreignObject>' +
        '<image xlink:href="#"></image></foreignObject><g>' +
        '<image xlink:href="#"></image></g></svg></div>',
    );
  });
});
