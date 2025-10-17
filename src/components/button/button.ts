import Block from "../../core/block";
import { noop } from "../../helpers/noop";
import type { BlockProps } from "../../core/types";

interface ButtonProps extends BlockProps {
  label: string;
  variant: "primary" | "secondary" | "error" | "warning";
  onClick?: (event: Event) => void;
  onSubmit?: (event: Event) => void;
}

export default class Button extends Block<ButtonProps> {
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
