import { h, Component } from "preact";

class Bar extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      foo: "baz",
    };
  }

  render() {
    return <div>Bar{this.state.foo}</div>;
  }
}

const Foo = () => <div>Foo</div>;

const withComponent = () => {
  return (
    <div class="foo">
      Hello World!
      <p>Text</p>
      <div><Foo /></div>
    </div>
  );
};

const withMoreComponents = () => {
  return (
    <div class="foo">
      Hello World!
      <p>Text</p>
      <div><Foo /></div>
      <div><Foo /><Foo /></div>
      <div><Foo /><Foo /><span class="var">foo</span></div>
      <span><Foo /><Foo /></span>
      <span><Foo /><p>Text</p><Foo /></span>
      <p class="var">Text</p>
      <div><Foo /></div>
      <div><Foo /><Foo /></div>
      <div><Foo /><Foo /><span>foo</span></div>
      <span class="var"><Foo /><Foo /></span>
      <span><Foo /><p class="var">Text</p><Foo /></span>
      <p>Text</p>
      <div><Foo /></div>
      <div class="var" data-bar="boof"><Foo /><Foo /></div>
      <div><Foo /><Foo /><span>foo</span></div>
      <span><Foo /><Foo /></span>
      <span class="var"><Foo /><p>Text</p><Foo /></span>
      <p>Text</p>
      <div><Foo /></div>
      <div class="var"><Foo /><Foo /></div>
      <div><Foo /><Foo /><span>foo</span></div>
      <span class="var"><Foo /><Foo /></span>
      <span><Foo /><p>Text</p><Foo /></span>
    </div>
  );
};

const Svg = () =>
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
  </div>;

export const viewSvg = Svg();
export const view = withComponent();
export const view2 = withMoreComponents();
