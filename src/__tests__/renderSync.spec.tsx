import { Component } from "preact";
import { React } from "../preview";
import { createRenderer, Renderer } from "../renderSync";
import StubRenderer from "./StubRenderer";

const stub = new StubRenderer();
const render = createRenderer(stub);

describe("renderSync", () => {
  it("should swap className with class", () => {
    render(<div className="foo" />);

    expect(stub.onOpenTag.mock.calls[0]).toEqual(["div", true, false, 0]);
    expect(stub.onProp.mock.calls.length).toEqual(1);
    expect(stub.onProp.mock.calls[0]).toEqual(["class", "foo", 0]);
  });

  it("should parse dangerouslySetInnerHTML", () => {
    const html = {
      __html: "<p>Hello</p>",
    };

    render(<div dangerouslySetInnerHTML={html as any} />);
    expect(stub.onProp.mock.calls.length).toEqual(0);
  });

  it("should parse boolean props", () => {
    render(<input disabled />);

    expect(stub.onOpenTag.mock.calls[0]).toEqual(["input", true, true, 0]);
    expect(stub.onProp.mock.calls.length).toEqual(1);
    expect(stub.onProp.mock.calls[0]).toEqual(["disabled", true, 0]);
  });

  it("should convert style object to string", () => {
    render(<div style={{ color: "red" }} />);

    expect(stub.onProp.mock.calls.length).toEqual(1);
    expect(stub.onProp.mock.calls[0]).toEqual(["style", "color: red;", 0]);
  });

  it("should skip undefined nodes", () => {
    render(undefined as any);

    expect(stub.onOpenTag.mock.calls.length).toEqual(0);
    expect(stub.onCloseTag.mock.calls.length).toEqual(0);
    expect(stub.onProp.mock.calls.length).toEqual(0);
  });

  it("should skip null nodes", () => {
    render(null as any);

    expect(stub.onOpenTag.mock.calls.length).toEqual(0);
    expect(stub.onCloseTag.mock.calls.length).toEqual(0);
    expect(stub.onProp.mock.calls.length).toEqual(0);
  });

  describe("Context", () => {
    const Inner = jest.fn((props, context) => (
      <div>{context && context.a}</div>
    ));

    beforeAll(() => Inner.mockClear());

    it("should pass context to grandchildren", () => {
      const CONTEXT = { a: "a", foo: null };
      const PROPS = { b: "b" };

      const spy = jest.fn(() => CONTEXT);
      class Outer extends Component<any, any> {
        getChildContext = spy;
        render(props) {
          return <Inner {...props} />;
        }
      }

      render(<Outer />);

      expect(spy.mock.calls.length).toEqual(1);
      expect(Inner.mock.calls[0]).toEqual([{ children: [] }, CONTEXT]);

      CONTEXT.foo = "bar";
      render(<Outer {...PROPS} />);

      expect(spy.mock.calls.length).toEqual(2);
      expect(Inner.mock.calls[1]).toEqual([
        { ...PROPS, children: [] },
        CONTEXT,
      ]);
    });

    it("should pass context to direct children", () => {
      const CONTEXT = { a: "a" };
      const PROPS = { b: "b" };

      const spy = jest.fn(() => CONTEXT);
      class Outer extends Component<any, any> {
        getChildContext = spy;
        render(props) {
          return <Inner {...props} />;
        }
      }

      render(<Outer />);

      expect(spy.mock.calls.length).toEqual(1);
      expect(Inner.mock.calls[2]).toEqual([{ children: [] }, CONTEXT]);

      (CONTEXT as any).foo = "bar";
      const res = render(<Outer {...PROPS} />);

      expect(spy.mock.calls.length).toEqual(2);
      expect(Inner.mock.calls[3]).toEqual([
        { ...PROPS, children: [] },
        CONTEXT,
      ]);

      // make sure render() could make use of context.a
      expect(Inner(...Inner.mock.calls[2])).toEqual({
        children: ["a"],
        attributes: undefined,
        key: undefined,
        nodeName: "div",
      });
    });

    it("should preserve existing context properties when creating child contexts", () => {
      let outerContext = { outer: true };
      let innerContext = { inner: true };

      class Outer extends Component<any, any> {
        getChildContext() {
          return { outerContext };
        }
        render() {
          return <Inner2 />;
        }
      }

      const spyInner = jest.fn(() => <InnerMost />);

      class Inner2 extends Component<any, any> {
        getChildContext() {
          return { innerContext };
        }
        render() {
          return spyInner(this.props, this.state, this.context);
        }
      }

      const spyInnerMost = jest.fn(() => <strong>test</strong>);
      class InnerMost extends Component<any, any> {
        render() {
          return spyInnerMost(this.props, this.state, this.context);
        }
      }

      render(<Outer />);

      expect(spyInner.mock.calls[0]).toEqual([
        { children: [] },
        {},
        { outerContext },
      ]);
      expect(spyInnerMost.mock.calls[0]).toEqual([
        { children: [] },
        {},
        { outerContext, innerContext },
      ]);
    });
  });

  describe("Fragments", () => {
    it("should render Fragment", () => {
      render(
        <div>
          <>Foo</>
        </div>,
      );

      // Should only be called for div
      expect(stub.onOpenTag.mock.calls.length).toEqual(1);
      expect(stub.onCloseTag.mock.calls.length).toEqual(1);
    });

    it("should render Fragment with keys", () => {
      const Fragment = React.Fragment;
      render(
        <div>
          <Fragment key="bob">Foo</Fragment>
        </div>,
      );

      // Should only be called for div
      expect(stub.onOpenTag.mock.calls.length).toEqual(1);
      expect(stub.onCloseTag.mock.calls.length).toEqual(1);
    });
  });
});
