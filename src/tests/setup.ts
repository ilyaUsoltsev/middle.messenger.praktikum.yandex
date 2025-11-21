import { JSDOM } from "jsdom";

// Create a virtual DOM environment
const dom = new JSDOM("<!DOCTYPE html><html><body><div id=\"app\"></div></body></html>", {
  url: "http://localhost:3000",
  pretendToBeVisual: true,
});

// Set up global browser objects
global.window = dom.window as unknown as Window & typeof globalThis;
global.document = dom.window.document;
global.HTMLElement = dom.window.HTMLElement;
global.Node = dom.window.Node;
global.history = dom.window.history;
global.location = dom.window.location;
