import { InputComponent } from "../../components";
import Block from "../../core/block";
import { getInputValueAndError } from "../../helpers/get-input-value-and-error";

export default class RegisterFormComponent extends Block {
  constructor() {
    super("div", {
      className: "inputs-container",
      FirstNameInput: new InputComponent({
        label: "First name",
        placeholder: "Enter your first name",
        name: "first_name",
        onChange: (e: Event) => {
          const { value, error } = getInputValueAndError(e, "name");
          this.getChild("FirstNameInput")?.setProps({ error, value });
        },
      }),
      SecondNameInput: new InputComponent({
        label: "Second name",
        placeholder: "Enter your last name",
        name: "second_name",
        onChange: (e: Event) => {
          const { value, error } = getInputValueAndError(e, "name");
          this.getChild("SecondNameInput")?.setProps({ error, value });
        },
      }),
      LoginInput: new InputComponent({
        label: "Login",
        placeholder: "Enter your login",
        name: "login",
        onChange: (e: Event) => {
          const { value, error } = getInputValueAndError(e, "login");
          this.getChild("LoginInput")?.setProps({ error, value });
        },
      }),
      PhoneInput: new InputComponent({
        label: "Phone",
        placeholder: "Enter your phone",
        name: "phone",
        onChange: (e: Event) => {
          const { value, error } = getInputValueAndError(e, "phone");
          this.getChild("PhoneInput")?.setProps({ error, value });
        },
      }),
      EmailInput: new InputComponent({
        label: "Email",
        placeholder: "Enter your email",
        name: "email",
        onChange: (e: Event) => {
          const { value, error } = getInputValueAndError(e, "email");
          this.getChild("EmailInput")?.setProps({ error, value });
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
      ConfirmPasswordInput: new InputComponent({
        label: "Confirm password",
        placeholder: "Confirm your password",
        name: "confirm_password",
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
            {{{ FirstNameInput }}}
            {{{ SecondNameInput }}}
            {{{ LoginInput }}}
            {{{ PhoneInput }}}
            {{{ EmailInput }}}
            {{{ PasswordInput }}}
            {{{ ConfirmPasswordInput }}}
        `;
  }
}
