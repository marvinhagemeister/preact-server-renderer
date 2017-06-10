import { h } from "preact";
import { assert as t } from "chai";
import { parse } from "../Parser";
import renderSync from "../renderSync";

describe("JsxRenderer", () => {
  it("should render self-closing elements", async () => {
    const res = await renderSync(<meta accept="foo" />);
    t.equal(res, '<meta\n  accept="foo"\n/>\n');
  });

  it("should render div", async () => {
    const res = await renderSync(<div />);
    t.equal(res, "<div></div>\n");
  });

  it("should render text children", async () => {
    const res = await renderSync(<div>foo</div>);
    t.equal(res, "<div>\n  foo\n</div>\n");
  });

  it("should render nested elements", async () => {
    const res = await renderSync(<div><div><p>foo</p></div></div>);
    t.equal(
      res,
      "<div>\n  <div>\n    <p>\n      foo\n    </p>\n  </div>\n</div>\n",
    );
  });
});
