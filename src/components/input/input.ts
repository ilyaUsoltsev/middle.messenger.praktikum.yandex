import Block from "../../core/block";
import type { BlockProps } from "../../core/types";
import { noop } from "../../helpers/noop";

interface InputProps extends BlockProps {
  type?: string;
  name?: string;
  placeholder?: string;
  onChange?: (e: Event) => void;
  label?: string;
  value?: string;
  error?: string;
  readOnly?: boolean;
  disabled?: boolean;
  accept?: string;
}

export default class InputComponent extends Block<InputProps> {
  constructor(props: InputProps) {
    super("div", {
      ...props,
      className: `input`,
      events: {
        change: props.onChange ?? noop,
      },
    });
  }

  public render(): string {
    return `
      <div class="input__container">
        {{#if label}}
            <label class="input__label" for="{{label}}">{{label}}</label>
        {{/if}}
        <input
            class="input__element {{#if error}} input__text-error{{/if}}"
            id="{{label}}"
            placeholder="{{placeholder}}"
            name="{{name}}"
            type="{{type}}"
            {{#if readOnly}} readonly {{/if}}
            {{#if disabled}} disabled {{/if}}
            {{#if value}} value="{{value}}" {{/if}}
            {{#if accept}} accept="{{accept}}" {{/if}}
        />
    </div>
        {{#if error}}
            <div class="input__error">
                <span class="input__text-error">{{error}}</span>
            </div>
        {{/if}}
    `;
  }
}
