import { InputComponent } from "../../components";
import Block from "../../core/block";
import { getInputValueAndError } from "../../helpers/get-input-value-and-error";

export default class LoginFormComponent extends Block {
  constructor() {
    super("div", {
      LoginInput: new InputComponent({
        label: "Login",
        placeholder: "Enter your login",
        name: "login",
        type: "text",
        onChange: (e: Event) => {
          const { value, error } = getInputValueAndError(e, "login");
          this.getChild("LoginInput")?.setProps({ error, value });
        },
      }),
      PasswordInput: new InputComponent({
        label: "Password",
        placeholder: "Enter your password",
        name: "password",
        type: "password",
        onChange: (e: Event) => {
          const { value, error } = getInputValueAndError(e, "password");
          this.getChild("PasswordInput")?.setProps({ error, value });
        },
      }),
    });
  }

  render() {
    return `
            {{{ LoginInput }}}
            {{{ PasswordInput }}}
        `;
  }
}
