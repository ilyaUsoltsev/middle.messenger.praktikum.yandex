import Block from "../../core/block";
import { noop } from "../../helpers/noop";

interface ButtonProps {
  label: string;
  variant: "primary" | "secondary" | "error" | "warning";
  onClick?: (event: Event) => void;
  onSubmit?: (event: Event) => void;
  attrs?: Record<string, string>;
}

export default class Button extends Block {
  constructor(props: ButtonProps) {
    super("button", {
      ...props,
      className: `button button__${props.variant}`,
      events: {
        click: props.onClick || noop,
        submit: props.onSubmit || noop,
      },
      attrs: {
        type: props.onSubmit ? "submit" : "button",
        ...props.attrs,
      },
    });
  }
  public render(): string {
    return `
      {{label}}
    `;
  }
}
