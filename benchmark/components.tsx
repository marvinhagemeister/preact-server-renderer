import { h } from "preact";

const Foo = () => <div>Foo</div>;
const Component = () => {
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
export const view = Component();
