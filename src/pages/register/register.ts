import type { CreateUser } from "../../api/types";
import { ButtonComponent, FormComponent, RegisterFormComponent } from "../../components";
import Block from "../../core/block";
import type { BlockProps } from "../../core/types";
import { connect } from "../../helpers/connect";
import { getFormData } from "../../helpers/get-form-data";
import { validateInput } from "../../helpers/validation";
import { withRouter } from "../../helpers/with-router";
import { registerUser } from "../../services/auth";
import type { AppState } from "../../types";

interface RegisterPageProps extends BlockProps {
  isLoading?: boolean;
  registerError?: string;
}

class RegisterPage extends Block<RegisterPageProps> {
  constructor(public props: RegisterPageProps) {
    super("main", {
      RegisterForm: new FormComponent({
        label: "Register",
        Body: new RegisterFormComponent(),
        onSubmitButtonLabel: "Send",
        className: "border",
        isLoading: props.isLoading,
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
          registerUser(data as CreateUser);
        },
        AdditionalButtons: new ButtonComponent({
          label: "Sign in",
          variant: "secondary",
          onClick: () => {
            window.router.go("/login");
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

const mapStateToProps = (state: AppState) => ({
  isLoading: state.isLoading,
  registerError: state.registerError,
});

export default connect(mapStateToProps)(withRouter(RegisterPage));
