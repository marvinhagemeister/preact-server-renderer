import { Component, VNode } from "preact";
import { React } from "../../preview";
import { createRenderer } from "../../renderSync";
import CompactRenderer from "../CompactRenderer";

/* tslint:disable:max-classes-per-file */

describe("CompactRenderer", () => {
  const renderer = new CompactRenderer();
  const render = createRenderer<string, CompactRenderer>(renderer);

  beforeEach(() => renderer.reset());

  it("should render self-closing elements", () => {
    const res = render(<meta accept="foo" />);
    expect(res).toEqual('<meta accept="foo" />');
  });

  it("should render div", () => {
    const res = render(<div />);
    expect(res).toEqual("<div></div>");
  });

  it("should render text children", () => {
    const res = render(<div>foo</div>);
    expect(res).toEqual("<div>foo</div>");
  });

  it("should encode text children", () => {
    const res = render(<div>{"<foo"}</div>);
    expect(res).toEqual("<div>&lt;foo</div>");
  });

  it("should render nested elements", () => {
    const res = render(
      <div>
        <div>
          <p>foo</p>
        </div>
      </div>,
    );
    expect(res).toEqual("<div><div><p>foo</p></div></div>");
  });

  it("should omit newlines in attributes", () => {
    const res = render(
      <div class={`foo\n\tbar\n\tbaz`}>
        <a>a</a>
        <b>b</b>
        c
      </div>,
    );

    expect(res).toEqual(
      '<div class="foo\n\tbar\n\tbaz"><a>a</a><b>b</b>c</div>',
    );
  });

  it("should escape falsey attributes", () => {
    const res = render(<div data-a={null} data-b={undefined} data-c={false} />);
    expect(res).toEqual("<div></div>");

    expect(render(<div data-foo={0} />)).toEqual('<div data-foo="0"></div>');
  });

  it("should collapse collapsible attributes", () => {
    const res = render(<div class="" style="" data-foo={true} data-bar />);

    expect(res).toEqual('<div class="" style="" data-foo data-bar></div>');
  });

  it("should omit functions", () => {
    /* tslint:disable-next-line */
    const res = render(<div data-a={() => {}} data-b={function() {}} />);
    expect(res).toEqual("<div></div>");
  });

  it("should omit key and ref attributes", () => {
    const res = render(<div key="foo" ref={() => undefined} />);
    expect(res).toEqual("<div></div>");
  });

  it("should encode entities", () => {
    const res = render(<div data-a={'"<>&'}>{'"<>&'}</div>);

    expect(res).toEqual(
      '<div data-a="&quot;&lt;&gt;&amp;">&quot;&lt;&gt;&amp;</div>',
    );
  });

  it("should omit falsey children", () => {
    const res = render(
      <div>
        {null}|{undefined}|{false}
      </div>,
    );
    expect(res).toEqual("<div>||</div>");
  });

  it("does not close void elements with closing tags", () => {
    const res = render(
      <input>
        <p>Hello World</p>
      </input>,
    );
    expect(res).toEqual("<input /><p>Hello World</p>");
  });

  it("should serialize object styles", () => {
    const res = render(<div style={{ color: "red", border: "none" }} />);
    expect(res).toEqual('<div style="color: red; border: none;"></div>');

    const res2 = render(<div style={{}} />);
    expect(res2).toEqual('<div style=""></div>');
  });

  it("should dangerouslySetInnerHTML", () => {
    const html = { __html: "<span>foo</span>" };
    const res = render(<div dangerouslySetInnerHTML={html} />);
    expect(res).toEqual("<div><span>foo</span></div>");
  });

  it("should sort attributes", () => {
    const res = createRenderer(new CompactRenderer(), {
      sort: true,
    })(<div style={{}} class="foo" />);
    expect(res).toEqual('<div class="foo" style=""></div>');
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

    expect(res).toEqual(
      '<div><svg><image xlink:href="#"></image><foreignObject>' +
        '<image xlink:href="#"></image></foreignObject><g>' +
        '<image xlink:href="#"></image></g></svg></div>',
    );
  });

  describe("Functional Components", () => {
    it("should render components", () => {
      const Foo = () => <div>foo</div>;
      const res = render(
        <div>
          <Foo />
        </div>,
      );
      expect(res).toEqual("<div><div>foo</div></div>");
    });

    it("should shallow render components", () => {
      const Foo = () => <div>foo</div>;
      const res = createRenderer(new CompactRenderer(), { shallow: true })(
        <div>
          <Foo />
        </div>,
      );
      expect(res).toEqual("<div><Foo /></div>");
    });

    it("should shallow render components with attributes", () => {
      const Foo = (props: { a: string }) => <div>foo {props.a}</div>;
      const res = createRenderer(new CompactRenderer(), {
        shallow: true,
      })(
        <div>
          <Foo a="bar" />
        </div>,
      );
      expect(res).toEqual('<div><Foo a="bar" /></div>');
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

      const Test: TestComponent = props => <div {...props as any} />;
      Test.defaultProps = { foo: "default foo", bar: "default bar" };

      expect(render(<Test />)).toEqual(
        '<div foo="default foo" bar="default bar"></div>',
      );
      expect(render(<Test bar="b" />)).toEqual(
        '<div foo="default foo" bar="b"></div>',
      );
      expect(render(<Test foo="a" bar="b" />)).toEqual(
        '<div foo="a" bar="b"></div>',
      );

      const Test2: TestComponent = props => <div {...props as any} />;
      Test2.defaultProps = undefined;

      expect(render(<Test2 />)).toEqual("<div></div>");
      expect(render(<Test2 bar="b" />)).toEqual('<div bar="b"></div>');
      expect(render(<Test2 foo="a" bar="b" />)).toEqual(
        '<div foo="a" bar="b"></div>',
      );
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

      expect(render(<Test foo="bar">content</Test>)).toEqual(
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

      expect(render(<Test>content</Test>)).toEqual(
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

      expect(render(<Test foo="bar">content</Test>)).toEqual(
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

      expect(render(<Test foo="bar">content</Test>)).toEqual(
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
