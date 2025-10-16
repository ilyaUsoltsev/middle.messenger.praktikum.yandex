import { InputComponent } from "../../components";
import Block from "../../core/block";
import { getInputValueAndError } from "../../helpers/get-input-value-and-error";

export default class PasswordFormComponent extends Block {
  constructor() {
    super("div", {
      className: "inputs-container",
      OldPasswordInput: new InputComponent({
        label: "Old password",
        placeholder: "Enter your old password",
        name: "oldPassword",
        type: "password",
        onChange: (e: Event) => {
          const { value, error } = getInputValueAndError(e, "password");
          this.getChild("OldPasswordInput")?.setProps({ error, value });
        },
      }),
      NewPasswordInput: new InputComponent({
        label: "New password",
        placeholder: "Enter your new password",
        name: "newPassword",
        type: "password",
        onChange: (e: Event) => {
          const { value, error } = getInputValueAndError(e, "password");
          this.getChild("NewPasswordInput")?.setProps({ error, value });
        },
      }),
      ConfirmPasswordInput: new InputComponent({
        label: "Confirm password",
        placeholder: "Confirm your new password",
        name: "confirmNewPassword",
        type: "password",
        onChange: (e: Event) => {
          const { value, error } = getInputValueAndError(e, "password");
          this.getChild("ConfirmPasswordInput")?.setProps({ error, value });
        },
      }),
    });
  }

  render() {
    return `
            {{{ OldPasswordInput }}}
            {{{ NewPasswordInput }}}
            {{{ ConfirmPasswordInput }}}
        `;
  }
}
