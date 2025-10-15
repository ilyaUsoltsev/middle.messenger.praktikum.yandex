import { ButtonComponent } from '../../components/button';
import InputComponent from '../../components/input/input';
import Block from '../../core/block';
import { validateInput } from '../../helpers/validation';

export class LoginPage extends Block {
  constructor() {
    super('main', {
      login: '',
      password: '',
      LoginInput: new InputComponent({
        label: 'Login',
        placeholder: 'Enter your login',
        name: 'login',
        type: 'text',
        onChange: (e: Event) => {
          const target = e.target as HTMLInputElement;
          const value = target.value;
          this.setProps({ login: value });
          const error = validateInput('login', value);
          this.getChild('LoginInput')?.setProps({ error, value });
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
      SignInButton: new ButtonComponent({
        label: 'Sign In',
        variant: 'primary',
        onClick: (e: Event) => {
          e.preventDefault();
          const loginError = validateInput('login', this.props.login);
          const passwordError = validateInput('password', this.props.password);
          this.getChild('LoginInput')?.setProps({ error: loginError });
          this.getChild('PasswordInput')?.setProps({ error: passwordError });
          console.log('Login:', this.props.login);
          console.log('Password:', this.props.password);
        },
      }),
      RegisterButton: new ButtonComponent({
        label: 'Register',
        variant: 'secondary',
        onClick: (e: Event) => {
          e.preventDefault();
          console.log('Register button clicked');
        },
      }),
    });
  }

  render() {
    return `
        <section class="container-section">
            <form class="login-form">
                <h1 class="login-title">Sign In</h1>
                {{{ LoginInput }}}
                {{{ PasswordInput }}}
                <div class="login-form__actions">
                    {{{ SignInButton }}}
                    {{{ RegisterButton }}}
                </div>
            </form>
        </section>
        `;
  }
}
