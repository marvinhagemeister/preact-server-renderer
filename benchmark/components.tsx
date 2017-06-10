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

export const view = Component();
