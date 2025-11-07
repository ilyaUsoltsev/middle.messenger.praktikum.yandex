import Block from "../../core/block";
import type { BlockProps } from "../../core/types";
import { ButtonComponent } from "../button";

interface DialogProps extends BlockProps {
  title: string;
  Body: Block;
  onConfirm: () => void;
  onCancel: () => void;
}

export default class DialogComponent extends Block<DialogProps> {
  constructor(props: DialogProps) {
    super("div", {
      ...props,
      className: "dialog-container",
      ConfirmButton: new ButtonComponent({
        label: "Confirm",
        variant: "primary",
        onClick: props.onConfirm,
      }),
      CancelButton: new ButtonComponent({
        label: "Cancel",
        variant: "error",
        onClick: props.onCancel,
      }),
    });
  }

  render(): string {
    return `
        <div class="dialog">
            <h2 class="dialog__title">{{title}}</h2>
            <div class="dialog__body">
            {{{Body}}}
            </div>
            <div class="dialog__footer">
                {{{ConfirmButton}}}
                {{{CancelButton}}}
            </div>
        </div>
  `;
  }
}
