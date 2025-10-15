import { ButtonComponent } from '../../components/button';
import InputComponent from '../../components/input/input';
import Block from '../../core/block';
import { validateInput } from '../../helpers/validation';

export class RegisterPage extends Block {
  constructor() {
    super('main', {
      firstName: '',
      secondName: '',
      login: '',
      phone: '',
      email: '',
      password: '',
      confirmPassword: '',
      FirstNameInput: new InputComponent({
        label: 'First name',
        placeholder: 'Enter your first name',
        name: 'first_name',
        onChange: (e: Event) => {
          const target = e.target as HTMLInputElement;
          const value = target.value;
          this.setProps({ firstName: value });
          const error = validateInput('name', value);
          this.getChild('FirstNameInput')?.setProps({ error, value });
        },
      }),
      SecondNameInput: new InputComponent({
        label: 'Second name',
        placeholder: 'Enter your last name',
        name: 'second_name',
        onChange: (e: Event) => {
          const target = e.target as HTMLInputElement;
          const value = target.value;
          this.setProps({ secondName: value });
          const error = validateInput('name', value);
          this.getChild('SecondNameInput')?.setProps({ error, value });
        },
      }),
      LoginInput: new InputComponent({
        label: 'Login',
        placeholder: 'Enter your login',
        name: 'login',
        onChange: (e: Event) => {
          const target = e.target as HTMLInputElement;
          const value = target.value;
          this.setProps({ login: value });
          const error = validateInput('login', value);
          this.getChild('LoginInput')?.setProps({ error, value });
        },
      }),
      PhoneInput: new InputComponent({
        label: 'Phone',
        placeholder: 'Enter your phone',
        name: 'phone',
        onChange: (e: Event) => {
          const target = e.target as HTMLInputElement;
          const value = target.value;
          this.setProps({ phone: value });
          const error = validateInput('phone', value);
          this.getChild('PhoneInput')?.setProps({ error, value });
        },
      }),
      EmailInput: new InputComponent({
        label: 'Email',
        placeholder: 'Enter your email',
        name: 'email',
        onChange: (e: Event) => {
          const target = e.target as HTMLInputElement;
          const value = target.value;
          this.setProps({ email: value });
          const error = validateInput('email', value);
          this.getChild('EmailInput')?.setProps({ error, value });
        },
      }),
      PasswordInput: new InputComponent({
        label: 'Password',
        placeholder: 'Enter your password',
        name: 'password',
        type: 'password',
        onChange: (e: Event) => {
          const target = e.target as HTMLInputElement;
          const value = target.value;
          this.setProps({ password: value });
          const error = validateInput('password', value);
          this.getChild('PasswordInput')?.setProps({ error, value });
        },
      }),
      ConfirmPasswordInput: new InputComponent({
        label: 'Confirm password',
        placeholder: 'Confirm your password',
        name: 'confirm_password',
        type: 'password',
        onChange: (e: Event) => {
          const target = e.target as HTMLInputElement;
          const value = target.value;
          this.setProps({ confirmPassword: value });
          const error = validateInput('password', value);
          this.getChild('ConfirmPasswordInput')?.setProps({ error, value });
        },
      }),
      RegisterButton: new ButtonComponent({
        label: 'Register',
        variant: 'primary',
        onClick: (e: Event) => {
          e.preventDefault();
          const firstNameError = validateInput('name', this.props.firstName);
          const secondNameError = validateInput('name', this.props.secondName);
          const loginError = validateInput('login', this.props.login);
          const phoneError = validateInput('phone', this.props.phone);
          const emailError = validateInput('email', this.props.email);
          const passwordError = validateInput('password', this.props.password);
          const confirmPasswordError = validateInput(
            'password',
            this.props.confirmPassword
          );

          this.getChild('FirstNameInput')?.setProps({ error: firstNameError });
          this.getChild('SecondNameInput')?.setProps({
            error: secondNameError,
          });
          this.getChild('LoginInput')?.setProps({ error: loginError });
          this.getChild('PhoneInput')?.setProps({ error: phoneError });
          this.getChild('EmailInput')?.setProps({ error: emailError });
          this.getChild('PasswordInput')?.setProps({ error: passwordError });
          this.getChild('ConfirmPasswordInput')?.setProps({
            error: confirmPasswordError,
          });

          if (
            !firstNameError &&
            !secondNameError &&
            !loginError &&
            !phoneError &&
            !emailError &&
            !passwordError &&
            !confirmPasswordError
          ) {
            if (this.props.password !== this.props.confirmPassword) {
              this.getChild('ConfirmPasswordInput')?.setProps({
                error: 'Passwords do not match',
              });
              return;
            }
            console.log('Registration data:', {
              firstName: this.props.firstName,
              secondName: this.props.secondName,
              login: this.props.login,
              phone: this.props.phone,
              email: this.props.email,
              password: this.props.password,
            });
          }
        },
      }),
      SignInButton: new ButtonComponent({
        label: 'Sign in',
        variant: 'secondary',
        onClick: (e: Event) => {
          e.preventDefault();
          console.log('Navigate to sign in page');
        },
      }),
    });
  }

  render() {
    return `
        <section class="container-section">
            <form class="register-form">
                <h1 class="register-title">Register</h1>
                {{{ FirstNameInput }}}
                {{{ SecondNameInput }}}
                {{{ LoginInput }}}
                {{{ PhoneInput }}}
                {{{ EmailInput }}}
                {{{ PasswordInput }}}
                {{{ ConfirmPasswordInput }}}
                <div class="register-form__actions">
                    {{{ RegisterButton }}}
                    {{{ SignInButton }}}
                </div>
            </form>
        </section>
        `;
  }
}
