import Block from "../../core/block";
import { ButtonComponent } from "../button";

interface FormProps {
  label: string;
  Body: Block;
  onSubmit: (event: Event) => void;
  error?: string;
  AdditionalButtons?: Block | Block[];
  onSubmitButtonLabel?: string;
}

export default class FormComponent extends Block {
  constructor(props: FormProps) {
    super("form", {
      ...props,
      className: `form-container`,
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
      <h1>{{label}}</h1>
      {{#if error}}
        <p class="form-error">{{error}}</p>
      {{/if}}
        {{{Body}}}
        <div class="form-actions">
        {{{ButtonSubmit}}}
        {{{AdditionalButtons}}}
        </div>
    `;
  }
}
