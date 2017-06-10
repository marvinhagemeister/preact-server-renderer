import { ComponentConstructor } from "preact";

export function getComponentName(component: ComponentConstructor<any, any>) {
  return component.name;
}
