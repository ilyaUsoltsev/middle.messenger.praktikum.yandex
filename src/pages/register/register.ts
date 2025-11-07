import { ButtonComponent, FormComponent, RegisterFormComponent } from "../../components";
import Block from "../../core/block";
import { getFormData } from "../../helpers/get-form-data";
import { validateInput } from "../../helpers/validation";

export default class RegisterPage extends Block {
  constructor() {
    super("main", {
      RegisterForm: new FormComponent({
        label: "Register",
        Body: new RegisterFormComponent(),
        onSubmitButtonLabel: "Send",
        className: "border",
        onSubmit: (e: SubmitEvent) => {
          e.preventDefault();
          const data = getFormData(e);
          const { first_name, second_name, login, phone, email, password, confirm_password } = data;
          const firstNameError = validateInput("name", first_name);
          const secondNameError = validateInput("name", second_name);
          const loginError = validateInput("login", login);
          const phoneError = validateInput("phone", phone);
          const emailError = validateInput("email", email);
          const passwordError = validateInput("password", password);
          const confirmPasswordError = validateInput("password", confirm_password);
          const hasErrors =
            firstNameError ||
            secondNameError ||
            loginError ||
            phoneError ||
            emailError ||
            passwordError ||
            confirmPasswordError;

          if (hasErrors) {
            this.getChild("RegisterForm")?.setProps({
              error: "Check inputs format",
            });
            return;
          } else {
            this.getChild("RegisterForm")?.setProps({ error: "" });
          }

          if (password !== confirm_password) {
            this.getChild("RegisterForm")?.setProps({
              error: "Passwords do not match",
            });
            return;
          }

          console.log("Form submitted with data:", data);
        },
        AdditionalButtons: new ButtonComponent({
          label: "Sign in",
          variant: "secondary",
          onClick: () => {
            console.log("Navigate to sign in page");
          },
        }),
      }),
    });
  }

  render() {
    return `
        <section class="centered">
            <div class="register-container">
                {{{ RegisterForm }}}
                <div class="register-form__secondary-actions">
                    {{{ SignInButton }}}
                </div>
            </div>
        </section>
        `;
  }
}
