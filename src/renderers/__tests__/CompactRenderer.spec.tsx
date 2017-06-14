import { h, Component, VNode } from "preact";
import { assert as t } from "chai";
import { createRenderer } from "../../renderSync";
import CompactRenderer from "../CompactRenderer";

/* tslint:disable:max-classes-per-file */

describe("CompactRenderer", () => {
  const renderer = new CompactRenderer();
  const render = createRenderer<string, CompactRenderer>(renderer);

  beforeEach(() => renderer.reset());

  it("should render self-closing elements", () => {
    const res = render(<meta accept="foo" />);
    t.equal(res, '<meta accept="foo" />');
  });

  it("should render div", () => {
    const res = render(<div />);
    t.equal(res, "<div></div>");
  });

  it("should render text children", () => {
    const res = render(<div>foo</div>);
    t.equal(res, "<div>foo</div>");
  });

  it("should encode text children", () => {
    const res = render(<div>{"<foo"}</div>);
    t.equal(res, "<div>&lt;foo</div>");
  });

  it("should render nested elements", () => {
    const res = render(
      <div>
        <div><p>foo</p></div>
      </div>,
    );
    t.equal(res, "<div><div><p>foo</p></div></div>");
  });

  it("should omit newlines in attributes", () => {
    const res = render(
      <div class={`foo\n\tbar\n\tbaz`}>
        <a>a</a>
        <b>b</b>
        c
      </div>,
    );

    t.equal(res, '<div class="foo\n\tbar\n\tbaz"><a>a</a><b>b</b>c</div>');
  });

  it("should escape falsey attributes", () => {
    const res = render(<div data-a={null} data-b={undefined} data-c={false} />);
    t.equal(res, "<div></div>");

    t.equal(render(<div data-foo={0} />), '<div data-foo="0"></div>');
  });

  it("should collapse collapsible attributes", () => {
    const res = render(<div class="" style="" data-foo={true} data-bar />);

    t.equal(res, '<div class="" style="" data-foo data-bar></div>');
  });

  it("should omit functions", () => {
    /* tslint:disable-next-line */
    const res = render(<div data-a={() => {}} data-b={function() {}} />);
    t.equal(res, "<div></div>");
  });

  it("should omit key and ref attributes", () => {
    const res = render(<div key="foo" ref={() => undefined} />);
    t.equal(res, "<div></div>");
  });

  it("should encode entities", () => {
    const res = render(<div data-a={'"<>&'}>{'"<>&'}</div>);

    t.equal(res, '<div data-a="&quot;&lt;&gt;&amp;">&quot;&lt;&gt;&amp;</div>');
  });

  it("should omit falsey children", () => {
    const res = render(<div>{null}|{undefined}|{false}</div>);
    t.equal(res, "<div>||</div>");
  });

  it("does not close void elements with closing tags", () => {
    const res = render(<input><p>Hello World</p></input>);
    t.equal(res, "<input /><p>Hello World</p>");
  });

  it("should serialize object styles", () => {
    const res = render(<div style={{ color: "red", border: "none" }} />);
    t.equal(res, '<div style="color: red; border: none;"></div>');

    const res2 = render(<div style={{}} />);
    t.equal(res2, '<div style=""></div>');
  });

  it("should dangerouslySetInnerHTML", () => {
    const html = { __html: "<span>foo</span>" };
    const res = render(<div dangerouslySetInnerHTML={html} />);
    t.equal(res, "<div><span>foo</span></div>");
  });

  it("should sort attributes", () => {
    const res = createRenderer(new CompactRenderer(), {
      sort: true,
    })(<div style={{}} class="foo" />);
    t.equal(res, '<div class="foo" style=""></div>');
  });

  it("should render SVG elements", () => {
    const res = render(
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

  describe("Functional Components", () => {
    it("should render components", () => {
      const Foo = () => <div>foo</div>;
      const res = render(<div><Foo /></div>);
      t.equal(res, "<div><div>foo</div></div>");
    });

    it("should shallow render components", () => {
      const Foo = () => <div>foo</div>;
      const res = createRenderer(new CompactRenderer(), { shallow: true })(
        <div><Foo /></div>,
      );
      t.equal(res, "<div><Foo /></div>");
    });

    it("should shallow render components with attributes", () => {
      const Foo = (props: { a: string }) => <div>foo {props.a}</div>;
      const res = createRenderer(new CompactRenderer(), {
        shallow: true,
      })(<div><Foo a="bar" /></div>);
      t.equal(res, '<div><Foo a="bar" /></div>');
    });

    it("should apply defaultProps", () => {
      interface Props {
        foo: string;
        bar: string;
      }

      interface TestComponent {
        (props?: Partial<Props>): JSX.Element;
        defaultProps?: Partial<Props>;
      }

      const Test: TestComponent = props => <div {...props} />;
      Test.defaultProps = { foo: "default foo", bar: "default bar" };

      t.equal(
        render(<Test />),
        '<div foo="default foo" bar="default bar"></div>',
      );
      t.equal(
        render(<Test bar="b" />),
        '<div foo="default foo" bar="b"></div>',
      );
      t.equal(render(<Test foo="a" bar="b" />), '<div foo="a" bar="b"></div>');

      const Test2: TestComponent = props => <div {...props} />;
      Test2.defaultProps = undefined;

      t.equal(render(<Test2 />), "<div></div>");
      t.equal(render(<Test2 bar="b" />), '<div bar="b"></div>');
      t.equal(render(<Test2 foo="a" bar="b" />), '<div foo="a" bar="b"></div>');
    });
  });

  describe("Class Components", () => {
    interface Props {
      foo: string;
      children?: JSX.Element;
    }

    it("should render", () => {
      class Test extends Component<Props, any> {
        render(props: any) {
          return <div class={props.foo}>{props.children}</div>;
        }
      }

      t.equal(
        render(<Test foo="bar">content</Test>),
        '<div class="bar">content</div>',
      );
    });

    it("should apply defaultProps", () => {
      class Test extends Component<Partial<Props>, any> {
        static defaultProps: Props = {
          foo: "default foo",
        };

        render(props: any) {
          return <div class={props.foo}>{props.children}</div>;
        }
      }

      t.equal(
        render(<Test>content</Test>),
        '<div class="default foo">content</div>',
      );
    });

    it("should execute componentWillMount hook", () => {
      class Test extends Component<Props, any> {
        componentWillMount() {
          this.props.foo = "nope";
        }
        render(props: any) {
          return <div class={props.foo}>{props.children}</div>;
        }
      }

      t.equal(
        render(<Test foo="bar">content</Test>),
        '<div class="nope">content</div>',
      );
    });

    it("should exec state", () => {
      class Test extends Component<Props, any> {
        constructor(props: any) {
          super(props);
          this.state = {
            test: "nope",
            bar: "hello",
          };
        }

        componentWillMount() {
          this.setState({
            bar: "world",
          });
        }

        render(props: any) {
          return <div class={this.state.test}>{this.state.bar}</div>;
        }
      }

      t.equal(
        render(<Test foo="bar">content</Test>),
        '<div class="nope">world</div>',
      );
    });

    it.skip("should pass context", () => {
      // TODO
    });

    it.skip("should render high-order components", () => {
      // TODO
    });

    it.skip("should lock state", () => {
      // TODO
    });
  });
});
