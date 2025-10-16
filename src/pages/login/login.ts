import { ButtonComponent, FormComponent, LoginFormComponent } from "../../components";
import Block from "../../core/block";
import { getFormData } from "../../helpers/get-form-data";
import { validateInput } from "../../helpers/validation";

export default class LoginPage extends Block {
  constructor() {
    super("main", {
      LoginForm: new FormComponent({
        label: "Sign In",
        Body: new LoginFormComponent(),
        onSubmitButtonLabel: "Login",
        onSubmit: (e: Event) => {
          e.preventDefault();
          const data = getFormData(e);
          const { login, password } = data;
          const loginError = validateInput("login", login);
          const passwordError = validateInput("password", password);
          const hasErrors = loginError || passwordError;

          if (hasErrors) {
            this.getChild("LoginForm")?.setProps({
              error: "Check inputs format",
            });
            return;
          } else {
            this.getChild("LoginForm")?.setProps({ error: "" });
          }

          console.log("Form submitted with data:", data);
        },
        AdditionalButtons: new ButtonComponent({
          label: "Register",
          variant: "secondary",
          onClick: (e: Event) => {
            e.preventDefault();
            console.log("Register button clicked");
          },
        }),
      }),
    });
  }

  render() {
    return `
        <section class="container-section">
            <div class="login-container">
                {{{ LoginForm }}}
                <div class="login-form__secondary-actions">
                    {{{ RegisterButton }}}
                </div>
            </div>
        </section>
        `;
  }
}
