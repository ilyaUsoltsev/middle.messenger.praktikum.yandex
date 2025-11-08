import Block from "../../core/block";
import { noop } from "../../helpers/noop";
import type { BlockProps } from "../../core/types";

interface ButtonProps extends BlockProps {
  label: string;
  variant: "primary" | "secondary" | "error" | "warning";
  onClick?: (event: Event) => void;
  onSubmit?: (event: SubmitEvent) => void;
  disabled?: boolean;
}

export default class Button extends Block<ButtonProps> {
  constructor(props: ButtonProps) {
    const disabled = props.disabled ? { disabled: "true" } : {};
    super("button", {
      ...props,
      className: `button button__${props.variant}`,
      events: {
        click: props.onClick || noop,
        submit: props.onSubmit || noop,
      },
      attrs: {
        type: props.onSubmit ? "submit" : "button",
        ...disabled,
        ...props.attrs,
      },
    });
  }

  componentDidUpdate(oldProps: ButtonProps, newProps: ButtonProps): boolean {
    // Update disabled attribute when disabled prop changes
    if (oldProps.disabled !== newProps.disabled) {
      const element = this.getContent();
      if (element) {
        if (newProps.disabled) {
          element.setAttribute("disabled", "true");
        } else {
          element.removeAttribute("disabled");
        }
      }
    }

    return false; // Don't re-render, just update the attribute
  }

  public render(): string {
    return `
      {{label}}
    `;
  }
}
