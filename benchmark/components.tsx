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
