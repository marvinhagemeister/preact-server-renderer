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
