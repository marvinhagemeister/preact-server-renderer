import { assert as t } from "chai";

describe("foo", () => {
  it("should return foo", () => {
    const foo = () => "foo";
    t.equal(foo(), "foo");
  });
});
