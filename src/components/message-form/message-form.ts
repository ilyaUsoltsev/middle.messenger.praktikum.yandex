import { InputComponent } from "..";
import Block from "../../core/block";
import { getInputValueAndError } from "../../helpers/get-input-value-and-error";

export default class MessageFormComponent extends Block {
  constructor() {
    super("div", {
      className: "inputs-container",
      MessageInput: new InputComponent({
        placeholder: "Type your message...",
        name: "message",
        type: "text",
        onChange: (e: Event) => {
          const { value } = getInputValueAndError(e, "message");
          this.getChild("MessageInput")?.setProps({ value });
        },
      }),
    });
  }

  render() {
    return `
            {{{ MessageInput }}}
        `;
  }
}
