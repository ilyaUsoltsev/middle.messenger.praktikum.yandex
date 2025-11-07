import Block from "../../core/block";
import { ButtonComponent } from "../button";

interface BackButtonProps {
  onClick: (event: Event) => void;
}

export default class BackButtonComponent extends Block {
  constructor(props: BackButtonProps) {
    super("span", {
      className: "back-button",
      BackButton: new ButtonComponent({
        label: "< Back to chats",
        variant: "secondary",
        onClick: props.onClick,
      }),
    });
  }

  public render(): string {
    return `{{{BackButton}}}`;
  }
}
