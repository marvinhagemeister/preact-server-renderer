import { h, ComponentConstructor } from "preact";
import { assert as t } from "chai";
import render, { Options } from "../index";

describe.skip("renderToString", () => {
  describe("compact mode", () => {
    const r = (element: any) => render(element, { mode: "compact" });

    it("should render self-closing element", () => {
      t.equal(r(<meta accept="utf8" />), '<meta accept="utf8"/>');
    });

    it("should render div", () => {
      t.equal(r(<div />), "<div></div>");
    });

    it("should render text children", () => {
      t.equal(r(<div>foo</div>), "<div>foo</div>");
    });

    it("should render p children", () => {
      t.equal(
        r(
          <div>
            <p>Hello World!</p>
          </div>,
        ),
        "<div><p>Hello World!</p></div>",
      );
    });
  });

  describe("jsx mode", () => {
    const r = (element: any) => render(element, { mode: "jsx" });

    it("should render self-closing element", () => {
      t.equal(r(<meta accept="utf8" />), '<meta\n  accept="utf8"\n/>');
    });

    it("should render nested elements", () => {
      t.equal(
        r(<div class="bar"><p>foo</p></div>),
        '<div\n  class="bar"\n>\n  <p>\n    foo\n  </p>\n</div>',
      );
    });
  });

  describe("shallow", () => {
    const r = (element: any) =>
      render(element, {
        mode: "compact",
        shallow: true,
      });

    it("should render normal children", () => {
      t.equal(r(<div><p>foo</p></div>), "<div><p>foo</p></div>");
    });

    it("should not execute child components", () => {
      const Foo = (props: { a: string }) => <div>{"Foo" + props.a}</div>;
      t.equal(r(<div><Foo a="2" /></div>), '<div><Foo a="2"/></div>');
    });

    it("should not execute nested components", () => {
      interface Props {
        a: string;
        children?: ComponentConstructor<any, any>;
      }

      const Foo = (props: Props) => {
        const { a, children } = props;
        return <div>{"Foo" + a}{children}</div>;
      };

      t.equal(
        r(<div><Foo a="2"><Foo a="3">asd</Foo></Foo></div>),
        '<div><Foo a="2"><Foo a="3">asd</Foo></Foo></div>',
      );
    });
  });
});
