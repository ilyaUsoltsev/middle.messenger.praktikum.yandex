import { expect } from "chai";
import HttpClient from "./http";

describe("HttpClient", () => {
  let client: HttpClient<string | number | boolean>;
  const baseUrl = "/test";

  beforeEach(() => {
    client = new HttpClient(baseUrl);
  });

  it("should create HttpClient instance with base URL", () => {
    expect(client).to.be.instanceOf(HttpClient);
  });

  it("should create GET request with query string", (done) => {
    const xhrMock = {
      open: (method: string, url: string) => {
        expect(method).to.equal("GET");
        expect(url).to.include("?name=test&value=123");
        done();
      },
      send: () => {},
      setRequestHeader: () => {},
      withCredentials: false,
      timeout: 0,
    } as unknown as XMLHttpRequest;

    const originalXHR = global.XMLHttpRequest;
    global.XMLHttpRequest = function () {
      return xhrMock;
    } as unknown as typeof XMLHttpRequest;

    client.get("/endpoint", {
      data: { name: "test", value: 123 },
    });

    global.XMLHttpRequest = originalXHR;
  });

  it("should send POST request with JSON data", (done) => {
    let capturedData = "";
    const xhrMock = {
      open: (method: string) => {
        expect(method).to.equal("POST");
      },
      send: (data: string) => {
        capturedData = data;
        const parsed = JSON.parse(capturedData);
        expect(parsed.name).to.equal("test");
        done();
      },
      setRequestHeader: () => {},
      withCredentials: false,
      timeout: 0,
    } as unknown as XMLHttpRequest;

    const originalXHR = global.XMLHttpRequest;
    global.XMLHttpRequest = function () {
      return xhrMock;
    } as unknown as typeof XMLHttpRequest;

    client.post("/endpoint", {
      data: { name: "test" },
    });

    global.XMLHttpRequest = originalXHR;
  });

  it("should send PUT request with JSON data", (done) => {
    const xhrMock = {
      open: (method: string) => {
        expect(method).to.equal("PUT");
        done();
      },
      send: () => {},
      setRequestHeader: () => {},
      withCredentials: false,
      timeout: 0,
    } as unknown as XMLHttpRequest;

    const originalXHR = global.XMLHttpRequest;
    global.XMLHttpRequest = function () {
      return xhrMock;
    } as unknown as typeof XMLHttpRequest;

    client.put("/endpoint", {
      data: { name: "updated" },
    });

    global.XMLHttpRequest = originalXHR;
  });

  it("should send DELETE request", (done) => {
    const xhrMock = {
      open: (method: string) => {
        expect(method).to.equal("DELETE");
        done();
      },
      send: () => {},
      setRequestHeader: () => {},
      withCredentials: false,
      timeout: 0,
    } as unknown as XMLHttpRequest;

    const originalXHR = global.XMLHttpRequest;
    global.XMLHttpRequest = function () {
      return xhrMock;
    } as unknown as typeof XMLHttpRequest;

    client.delete("/endpoint");

    global.XMLHttpRequest = originalXHR;
  });
});
