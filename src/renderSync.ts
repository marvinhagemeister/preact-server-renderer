import { Options } from "./index";
import JsxRenderer from "./JsxRenderer";

export default function renderSync(options: Options): Promise<string> {
  return new Promise((resolve, reject) => {
    const renderer = new JsxRenderer(resolve);
  });
}
