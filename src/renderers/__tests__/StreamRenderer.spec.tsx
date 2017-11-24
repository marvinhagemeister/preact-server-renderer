import { h } from "preact";
import StreamRenderer from "../StreamRenderer";
import { createRenderer } from "../../renderSync";
import { WriteStream } from "fs";
import { Writable } from "stream";

jest.setTimeout(1000);

describe("StreamRenderer", () => {
  const render = createRenderer<StreamRenderer>(new StreamRenderer());
  it("should ", done => {
    const stream = render(<div>Hello World</div>);

    let res = "";
    const writer = new Writable({
      write(x, enc, next) {
        res += x.toString();
        next();
      },
    });

    stream.pipe(writer);
    stream.on("end", () => {
      expect(res).toEqual("<div>Hello World</div>");
      done();
    });
  });
});
