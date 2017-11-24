# Preact Server Renderer

`preact-server-render` is similar to
[preact-render-to-string](https://github.com/developit/preact-render-to-string)
by [@developit](https://github.com/developit/) (author of preact), but with
pluggable formatters. This means you can easily tailer the output to your needs,
without any overhead. Wether you have a snapshot renderer, or a custom format in
mind. Performance wise, both libraries are equal, only the jsx renderer is a
tiny bit faster here.

Features:

* **true** stream-based rendering
* JSX-Renderer ideal for snapshot tests
* Easily write your own renderer

## Installation

```bash
# npm
npm install preact-server-renderer

# yarn
yarn add preact-server-renderer
```

## Usage

```jsx
const {
  createRenderer,
  CompactRenderer,
  JsxRenderer,
} = require("preact-server-renderer");

// Default rendering
const render = createRenderer(new CompactRenderer());
const html = render(<div />);

// JSX rendering
const renderJsx = createRenderer(new JsxRenderer());
const html2 = renderJsx(<div />);

// shallow rendering
const shallow = createRenderer(new CompactRenderer(), { shallow: true });
const html3 = shallow(<div />);
```

### CompactRenderer

The `CompactRenderer` is the standard html renderer. It doesn't add any
whitespace and simply renders the components to a string. If you are looking for
**maximum performance** use `StreamRenderer` instead.

Example:

```jsx
const { createRenderer, CompactRenderer } = require("preact-server-renderer");

const render = createRenderer(new CompactRenderer());
console.log(
  render(
    <div class="foo">
      <h1>Hello</h1>
    </div>,
  ),
);
```

Output:

```txt
<div class="foo"><h1>Hello</h1></div>
```

### StreamRenderer

Renders the same output as the `CompactRenderer` but streams as soon as a chunk
is available. The most common way is to pipe the stream into the response
object. This drastically improves performance because the renderer will begin
sending chunks even before rendering has finished.

```jsx
const { createRenderer, StreamRenderer } = require("preact-server-renderer");

const render = createRenderer(new StreamRenderer());
const stream = render(
  <div class="foo">
    <h1>Hello</h1>
  </div>,
);

stream.pipe(MyWritableStream); // usually `stream.pipe(res)`
```

### JsxRenderer

This one is meant for snapshot tests, like they are found in [jest]().

Example:

```jsx
const { createRenderer, JsxRenderer } = require("preact-server-renderer");

const render = createRenderer(new JsxRenderer());
console.log(
  render(
    <div class="foo">
      <h1>Hello</h1>
    </div>,
  ),
);
```

Output:

```txt
<div
  class="foo"
>
  <h1>
    Hello
  </h1>
</div>
```

## Writing A Custom Renderer

This is where this library really shines. Custom renderers can be easily plugged
into the `createRenderer` function. They basically have a few callbacks for the
specific parsing steps. They simply need to adhere to the following interface
and that's it!

```ts
interface Renderer<T> {
  // Returns the render result, whatever that may be in your case
  done(): T;

  /** Reset the current instance */
  reset(): void;

  /** Called when an attribute is parsed */
  onProp(
    name: string,
    value: string | boolean | undefined | null,
    depth: number,
  ): void;

  /** Called at the start of each new vnode object */
  onOpenTag(
    name: string,
    hasChildren: boolean,
    isVoid: boolean,
    depth: number,
  ): void;

  /** Called when attribute parsing is done for the current vnode */
  onOpenTagClose(
    name: string,
    hasAttributes: boolean,
    isVoid: boolean,
    hasChildren: boolean,
    depth: number,
  ): void;

  /** Called when the node is a simple string */
  onTextNode(text: string, depth: number): void;

  /** Called when all children of the current vnode are parsed */
  onCloseTag(name: string, isVoid: boolean, depth: number): void;

  /** Called when vnode has it's own html (f.ex. jQuery plugins) */
  onDangerousInnerHTML(html: string): void;
}
```

## Known Issues

* `Context` ist currently not supported yet

## License

MIT, see [LICENSE.md](LICENSE.md).
