import { expect } from "chai";
import { noop } from "./noop";

describe("Typescript + Babel usage suite", () => {
  it("should return undefined", () => {
    expect(noop()).to.equal(undefined);
  });
});
