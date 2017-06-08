import { h } from "preact";
import { assert as t } from "chai";
import { renderToString, Options } from "../index";

describe("renderToString", () => {
  describe("compact mode", () => {
    const render = (element: any) =>
      renderToString(element, { mode: "compact" });

    it("should render self-closing element", () => {
      t.equal(render(<meta accept="utf8" />), '<meta accept="utf8"/>');
    });

    it("should render div", () => {
      t.equal(render(<div />), "<div></div>");
    });

    it("should render text children", () => {
      t.equal(render(<div>foo</div>), "<div>foo</div>");
    });

    it("should render p children", () => {
      t.equal(
        render(
          <div>
            <p>Hello World!</p>
          </div>,
        ),
        "<div><p>Hello World!</p></div>",
      );
    });
  });
});
