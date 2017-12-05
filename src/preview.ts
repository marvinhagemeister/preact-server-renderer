import { h } from "preact";

export interface Props {
  key?: string;
  children?: any;
}

function Fragment(props: Props) {
  return props.children;
}

export const React = {
  createElement: h,
  Fragment,
};
