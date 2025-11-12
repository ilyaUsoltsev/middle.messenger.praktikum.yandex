import Block from "../../core/block";
import { getInputValueAndError } from "../../helpers/get-input-value-and-error";
import { InputComponent } from "../input";

interface ProfileFormProps {
  first_name: string;
  second_name: string;
  display_name: string;
  login: string;
  email: string;
  phone: string;
}

export default class ProfileFormComponent extends Block {
  constructor(props: ProfileFormProps) {
    super("div", {
      className: "inputs-container",
      FirstNameInput: new InputComponent({
        label: "First name",
        name: "first_name",
        value: props.first_name,
        onChange: (e: Event) => {
          const { value, error } = getInputValueAndError(e, "name");
          this.getChild("FirstNameInput")?.setProps({ error, value });
        },
      }),
      SecondNameInput: new InputComponent({
        label: "Second name",
        name: "second_name",
        value: props.second_name,
        onChange: (e: Event) => {
          const { value, error } = getInputValueAndError(e, "name");
          this.getChild("SecondNameInput")?.setProps({ error, value });
        },
      }),
      NicknameInput: new InputComponent({
        label: "Nickname",
        name: "display_name",
        value: props.display_name,
        onChange: (e: Event) => {
          const { value, error } = getInputValueAndError(e, "name");
          this.getChild("NicknameInput")?.setProps({ error, value });
        },
      }),
      LoginInput: new InputComponent({
        label: "Login",
        name: "login",
        value: props.login,
        onChange: (e: Event) => {
          const { value, error } = getInputValueAndError(e, "login");
          this.getChild("LoginInput")?.setProps({ error, value });
        },
      }),
      EmailInput: new InputComponent({
        label: "Email",
        name: "email",
        value: props.email,
        onChange: (e: Event) => {
          const { value, error } = getInputValueAndError(e, "email");
          this.getChild("EmailInput")?.setProps({ error, value });
        },
      }),
      PhoneInput: new InputComponent({
        label: "Phone",
        name: "phone",
        value: props.phone,
        onChange: (e: Event) => {
          const { value, error } = getInputValueAndError(e, "phone");
          this.getChild("PhoneInput")?.setProps({ error, value });
        },
      }),
    });
  }

  render() {
    return `
            {{{ FirstNameInput }}}
            {{{ SecondNameInput }}}
            {{{ NicknameInput }}}
            {{{ LoginInput }}}
            {{{ EmailInput }}}
            {{{ PhoneInput }}}
        `;
  }
}
