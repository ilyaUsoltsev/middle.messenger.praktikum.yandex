import Block from "../../core/block";

interface ButtonProps {
  label: string;
  variant: "primary" | "secondary" | "error" | "warning";
  onClick: (event: Event) => void;
}

export default class Button extends Block {
  constructor(props: ButtonProps) {
    super("button", {
      ...props,
      className: `button button__${props.variant}`,
      events: {
        click: props.onClick,
      },
    });
  }
  public render(): string {
    return `
      {{label}}
    `;
  }
}
