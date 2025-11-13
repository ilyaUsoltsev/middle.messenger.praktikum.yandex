import Block from "../../core/block";
import type { BlockProps } from "../../core/types";
import { ButtonComponent } from "../button";

interface FormProps extends BlockProps {
  Body: Block;
  onSubmit: (event: SubmitEvent) => void;
  label?: string;
  error?: string;
  AdditionalButtons?: Block | Block[];
  onSubmitButtonLabel?: string;
  className?: string;
  isLoading?: boolean;
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
        disabled: props.isLoading,
      }),
    });
  }

  componentDidUpdate(oldProps: FormProps, newProps: FormProps): boolean {
    // Update ButtonSubmit when isLoading changes
    if (oldProps.isLoading !== newProps.isLoading) {
      this.getChild("ButtonSubmit")?.setProps({ disabled: newProps.isLoading });
    }

    return true;
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
