import Block from "./block";
import type { BlockProps, Nullable } from "./types";

interface RouteProps {
  rootQuery: string;
}

type BlockConstructor = new () => Block<BlockProps>;

function render(query: string, block: Block<BlockProps>): void {
  const root = document.querySelector(query);
  if (!root) {
    throw new Error(`Root element not found: ${query}`);
  }
  const content = block.getContent();
  if (!content) {
    throw new Error("Block content is null");
  }
  root.innerHTML = "";
  root.appendChild(content);
}

function isEqual(lhs: string, rhs: string): boolean {
  return lhs === rhs;
}

// Responsible for a single route (url) and corresponding Block
// Can hide and show the Block
class Route {
  private _pathname: string;
  private _blockClass: BlockConstructor;
  private _block: Nullable<Block<BlockProps>>;
  private _props: RouteProps;

  constructor(pathname: string, view: BlockConstructor, props: RouteProps) {
    this._pathname = pathname;
    this._blockClass = view;
    this._block = null;
    this._props = props;
  }

  navigate(pathname: string): void {
    if (this.match(pathname)) {
      this._pathname = pathname;
      this.render();
    }
  }

  leave(): void {
    if (this._block) {
      this._block.hide();
    }
  }

  match(pathname: string): boolean {
    return isEqual(pathname, this._pathname);
  }

  render(): void {
    if (!this._block) {
      this._block = new this._blockClass();
      render(this._props.rootQuery, this._block);
      return;
    }

    this._block.show();
  }
}

export default Route;
