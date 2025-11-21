/* eslint-disable @typescript-eslint/no-unused-expressions */
import { expect } from "chai";
import Block from "./block";
import type { BlockProps } from "./types";

interface TestProps extends BlockProps {
  text?: string;
  className?: string;
  child?: Block;
  children?: Block[];
  getValue?: () => number;
}

describe("Block Component", () => {
  class TestBlock extends Block<TestProps> {
    constructor(props: TestProps = {}) {
      super("div", { ...props });
    }

    render() {
      return `<div>{{text}}</div>`;
    }
  }

  class TestBlockWithChildren extends Block<TestProps> {
    constructor(props: TestProps = {}) {
      super("div", { ...props });
    }

    render() {
      return `<div>{{{child}}}</div>`;
    }
  }

  describe("Component creation", () => {
    it("should create component instance with default div tag", () => {
      const block = new TestBlock();
      expect(block).to.be.instanceOf(Block);
      expect(block.element?.tagName).to.equal("DIV");
    });

    it("should set attributes on element", () => {
      const block = new TestBlock({
        attrs: {
          id: "test-id",
          "data-testid": "test-block",
        },
      });
      expect(block.element?.getAttribute("id")).to.equal("test-id");
      expect(block.element?.getAttribute("data-testid")).to.equal("test-block");
    });

    it("should generate unique ID for each component", () => {
      const block1 = new TestBlock();
      const block2 = new TestBlock();
      expect(block1._id).to.not.equal(block2._id);
      expect(block1._id).to.have.lengthOf(7);
    });
  });

  describe("Props management", () => {
    it("should initialize with provided props", () => {
      const props = { text: "Hello World", className: "test" };
      const block = new TestBlock(props);
      expect(block.props.text).to.equal("Hello World");
      expect(block.props.className).to.equal("test");
    });

    it("should update props with setProps", () => {
      const block = new TestBlock({ text: "Initial" });
      block.setProps({ text: "Updated" });
      expect(block.props.text).to.equal("Updated");
    });

    it("should trigger re-render when props change", () => {
      const block = new TestBlock({ text: "Initial" });
      const initialHTML = block.element?.innerHTML;
      block.setProps({ text: "Updated" });
      const updatedHTML = block.element?.innerHTML;
      expect(initialHTML).to.not.equal(updatedHTML);
    });
  });

  describe("Children management", () => {
    it("should separate children from props", () => {
      const childBlock = new TestBlock({ text: "Child" });
      const parentBlock = new TestBlockWithChildren({
        text: "Parent",
        child: childBlock,
      });
      expect(parentBlock.children.child).to.equal(childBlock);
      expect(parentBlock.props.text).to.equal("Parent");
    });

    it("should handle array of children", () => {
      const child1 = new TestBlock({ text: "Child 1" });
      const child2 = new TestBlock({ text: "Child 2" });
      const parentBlock = new TestBlockWithChildren({
        children: [child1, child2],
      });
      expect(parentBlock.children.children).to.be.an("array");
      expect(parentBlock.children.children).to.have.lengthOf(2);
    });

    it("should retrieve child by key", () => {
      const childBlock = new TestBlock({ text: "Child" });
      const parentBlock = new TestBlockWithChildren({
        child: childBlock,
      });
      const retrievedChild = parentBlock.getChild("child");
      expect(retrievedChild).to.equal(childBlock);
    });
  });

  describe("Lifecycle hooks", () => {
    it("should call componentDidMount on initialization", (done) => {
      class TestBlockWithMount extends TestBlock {
        componentDidMount() {
          done();
        }
      }
      new TestBlockWithMount();
    });

    it("should call componentDidUpdate when props change", (done) => {
      class TestBlockWithUpdate extends TestBlock {
        componentDidUpdate() {
          done();
          return true;
        }
      }
      const block = new TestBlockWithUpdate();
      block.setProps({ text: "Updated" });
    });

    it("should not re-render if componentDidUpdate returns false", () => {
      class TestBlockNoRerender extends TestBlock {
        componentDidUpdate() {
          return false;
        }
      }
      const block = new TestBlockNoRerender({ text: "Initial" });
      const initialHTML = block.element?.innerHTML;
      block.setProps({ text: "Updated" });
      const updatedHTML = block.element?.innerHTML;
      expect(initialHTML).to.equal(updatedHTML);
    });
  });

  describe("Event handling", () => {
    it("should attach event listeners from props", () => {
      let clicked = false;
      const handleClick = () => {
        clicked = true;
      };
      const block = new TestBlock({
        events: {
          click: handleClick,
        },
      });
      block.element?.click();
      expect(clicked).to.be.true;
    });

    it("should remove event listeners on re-render", () => {
      let clickCount = 0;
      const handleClick = () => {
        clickCount++;
      };
      const block = new TestBlock({
        events: {
          click: handleClick,
        },
      });
      block.element?.click();
      expect(clickCount).to.equal(1);

      // Update props to trigger re-render
      block.setProps({ text: "Updated" });
      // Old listener should be removed, but new one added
      block.element?.click();
      expect(clickCount).to.equal(2);
    });
  });

  describe("Rendering", () => {
    it("should compile template with props", () => {
      const block = new TestBlock({ text: "Hello World" });
      expect(block.element?.textContent).to.include("Hello World");
    });

    it("should render template correctly", () => {
      const block = new TestBlock({ text: "Test Content" });
      expect(block.element?.innerHTML).to.include("Test Content");
    });
  });

  describe("Display control", () => {
    it("should show element", () => {
      const block = new TestBlock();
      block.hide();
      block.show();
      expect(block.element?.style.display).to.equal("block");
    });

    it("should hide element", () => {
      const block = new TestBlock();
      block.hide();
      expect(block.element?.style.display).to.equal("none");
    });

    it("should throw error when trying to show without element", () => {
      const block = new TestBlock();
      block._element = null;
      expect(() => block.show()).to.throw("No element to show");
    });

    it("should throw error when trying to hide without element", () => {
      const block = new TestBlock();
      block._element = null;
      expect(() => block.hide()).to.throw("No element to hide");
    });
  });

  describe("Content retrieval", () => {
    it("should return element from getContent", () => {
      const block = new TestBlock();
      const content = block.getContent();
      expect(content).to.equal(block.element);
    });

    it("should return element from element getter", () => {
      const block = new TestBlock();
      expect(block.element).to.be.instanceOf(HTMLElement);
    });
  });

  describe("Props proxy behavior", () => {
    it("should prevent property deletion", () => {
      const block = new TestBlock({ text: "Test" });
      expect(() => {
        delete block.props.text;
      }).to.throw("No access");
    });

    it("should bind function props to target", () => {
      const obj = {
        value: 42,
        getValue: function () {
          return this.value;
        },
      };
      const block = new TestBlock(obj as unknown as TestProps);
      expect(block.props?.getValue?.()).to.equal(42);
    });
  });
});
