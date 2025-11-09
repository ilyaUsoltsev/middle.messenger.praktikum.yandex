import type { LoginRequestData } from "../../api/types";
import { ButtonComponent, FormComponent, LoginFormComponent } from "../../components";
import Block from "../../core/block";
import type { BlockProps } from "../../core/types";
import { connect } from "../../helpers/connect";
import { getFormData } from "../../helpers/get-form-data";
import { validateInput } from "../../helpers/validation";
import { withRouter } from "../../helpers/with-router";
import { loginUser } from "../../services/auth";
import type { AppState } from "../../types";

interface LoginPageProps extends BlockProps {
  isLoading?: boolean;
  loginError?: string;
}

class LoginPage extends Block<LoginPageProps> {
  constructor(props: LoginPageProps) {
    super("main", {
      ...props,
      LoginForm: new FormComponent({
        label: "Sign In",
        Body: new LoginFormComponent(),
        onSubmitButtonLabel: "Login",
        className: "border",
        isLoading: props.isLoading,
        onSubmit: (e: SubmitEvent) => {
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
          loginUser(data as LoginRequestData);
        },
        AdditionalButtons: new ButtonComponent({
          label: "Register",
          variant: "secondary",
          onClick: (e: Event) => {
            e.preventDefault();
            window.router.go("/register");
          },
        }),
      }),
    });
  }

  componentDidUpdate(oldProps: LoginPageProps, newProps: LoginPageProps): boolean {
    // Update LoginForm when isLoading changes
    if (oldProps.isLoading !== newProps.isLoading) {
      console.log("Updating isLoading to:", newProps.isLoading);
      this.getChild("LoginForm")?.setProps({ isLoading: newProps.isLoading });
    }

    // Update LoginForm when loginError changes
    if (oldProps.loginError !== newProps.loginError) {
      this.getChild("LoginForm")?.setProps({ error: newProps.loginError });
    }

    return true;
  }

  render() {
    return `
        <section class="centered">
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

const mapStateToProps = (state: AppState) => ({
  isLoading: state.isLoading,
  loginError: state.loginError,
});

export default connect(mapStateToProps)(withRouter(LoginPage));
