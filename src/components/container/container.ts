import Block from "../../core/block";

interface ContainerProps {
  Body: Block;
}

export default class Container extends Block {
  constructor(props: ContainerProps) {
    super("section", {
      ...props,
      className: `container-section`,
    });
  }
  public render(): string {
    return `
      {{{Body}}}
    `;
  }
}
