import { VNode } from "preact";

// Taken from `preact-render-to-string` by @developit
// See: https://github.com/developit/preact-render-to-string/blob/master/src/util.js#L73
export function getNodeProps(vnode: VNode) {
  const props = {
    ...(vnode.nodeName as any).defaultProps,
    ...vnode.attributes,
  };

  if (vnode.children !== undefined) {
    props.children = vnode.children;
  }

  return props;
}
