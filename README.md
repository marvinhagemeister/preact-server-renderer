# Preact Server Renderer

`preact-server-render` is similar to `preact-render-to-string`by @developit,
but with pluggable formatters. The underlying DFS algorithm is the same,
so there aren't any performance differences, only the jsx renderer is a bit
faster here.

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
const html = render(<div></div>);

// JSX rendering
const renderJsx = createRenderer(new JsxRenderer());
const html2 = renderJsx(<div></div>);

// shallow rendering
const render3 = createRenderer(new CompactRenderer(), { shallow: true });
const html3 = render3(<div></div>);
```

### CompactRenderer

The `CompactRenderer` is the standard html renderer. It doesn't add any
whitespace and simply renders the components to a string.

Example:

```jsx
const {
   createRenderer,
   CompactRenderer,
} = require("preact-server-renderer");

const render = createRenderer(new CompactRenderer());
console.log(render(<div class="foo"><h1>Hello</h1></div>));
```

Output:

```txt
<div class="foo"><h1>Hello</h1></div>
```

### JsxRenderer

This one is meant for snapshot tests, like they are found in [jest]().

Example:

```jsx
const {
   createRenderer,
   JsxRenderer,
} = require("preact-server-renderer");

const render = createRenderer(new JsxRenderer());
console.log(render(<div class="foo"><h1>Hello</h1></div>));
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

This is where this library really shines. Custom renderers can be easily
plugged into the `createRenderer` function. They basically have a few callbacks
for the specific parsing steps. They simply need to adhere to the following
interface and that's it!

```ts
interface Renderer<T> {
  output: T; // Can be anything you want
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

- `Context` ist currently not supported yet

## License

MIT, see [LICENSE.md](LICENSE.md).
