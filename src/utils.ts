import { ComponentConstructor, VNode, FunctionalComponent } from "preact";

export function getComponentName(component: ComponentConstructor<any, any>) {
  return component.name;
}

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

export function isFunctional(node: any): node is FunctionalComponent<any> {
  return !node.prototype || typeof node.prototype.render !== "function";
}
