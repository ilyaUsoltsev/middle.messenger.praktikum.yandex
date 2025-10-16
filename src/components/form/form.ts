import Block from "../../core/block";
import { noop } from "../../helpers/noop";
import { ButtonComponent } from "../button";

interface FormProps {
  label: string;
  Body: Block;
  onSubmit: (event: Event) => void;
  error?: string;
  onCancel?: (event: Event) => void;
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
      onCancel: props.onCancel,
      ButtonSubmit: new ButtonComponent({
        label: "Submit",
        variant: "primary",
        onSubmit: props.onSubmit,
      }),
      ButtonCancel: new ButtonComponent({
        label: "Cancel",
        variant: "secondary",
        onClick: props.onCancel ?? noop,
      }),
    });
  }
  public render(): string {
    const withCancelButton = Boolean(this.props.onCancel);

    return `
      <h1>{{label}}</h1>
      {{#if error}}
        <p class="form-error">{{error}}</p>
      {{/if}}
        {{{Body}}}
        <div class="form-actions">
        {{{ButtonSubmit}}}
          {{#if ${withCancelButton}}}
            {{{ButtonCancel}}}
          {{/if}}
        </div>
    `;
  }
}
