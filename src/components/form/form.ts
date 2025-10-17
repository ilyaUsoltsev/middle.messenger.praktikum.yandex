import Block from "../../core/block";
import type { BlockProps } from "../../core/types";
import { ButtonComponent } from "../button";

interface FormProps extends BlockProps {
  Body: Block;
  onSubmit: (event: Event) => void;
  label?: string;
  error?: string;
  AdditionalButtons?: Block | Block[];
  onSubmitButtonLabel?: string;
  className?: string;
}

export default class FormComponent extends Block<FormProps> {
  constructor(props: FormProps) {
    super("form", {
      ...props,
      className: `form-container ${props.className ?? ""}`,
      events: {
        submit: props.onSubmit,
      },
      onSubmit: props.onSubmit,
      AdditionalButtons: props.AdditionalButtons,
      ButtonSubmit: new ButtonComponent({
        label: props.onSubmitButtonLabel ?? "Submit",
        variant: "primary",
        onSubmit: props.onSubmit,
      }),
    });
  }
  public render(): string {
    return `
      {{#if label}}
        <h1>{{label}}</h1>
      {{/if}}
      {{{Body}}}
      {{#if error}}
        <p class="form-error">{{error}}</p>
      {{/if}}
      <div class="form-actions">
      {{{ButtonSubmit}}}
      {{{AdditionalButtons}}}
      </div>
    `;
  }
}
