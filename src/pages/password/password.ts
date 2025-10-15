import BackButtonComponent from '../../components/back-button/back-button';
import { ButtonComponent } from '../../components/button';
import InputComponent from '../../components/input/input';
import Block from '../../core/block';
import { validateInput } from '../../helpers/validation';

export class PasswordPage extends Block {
  constructor() {
    super('main', {
      oldPassword: '',
      newPassword: '',
      confirmNewPassword: '',
      OldPasswordInput: new InputComponent({
        label: 'Old password',
        placeholder: 'Enter your old password',
        name: 'oldPassword',
        type: 'password',
        onChange: (e: Event) => {
          const target = e.target as HTMLInputElement;
          const value = target.value;
          this.setProps({ oldPassword: value });
          const error = validateInput('password', value);
          this.getChild('OldPasswordInput')?.setProps({ error, value });
        },
      }),
      NewPasswordInput: new InputComponent({
        label: 'New password',
        placeholder: 'Enter your new password',
        name: 'newPassword',
        type: 'password',
        onChange: (e: Event) => {
          const target = e.target as HTMLInputElement;
          const value = target.value;
          this.setProps({ newPassword: value });
          const error = validateInput('password', value);
          this.getChild('NewPasswordInput')?.setProps({ error, value });
        },
      }),
      ConfirmPasswordInput: new InputComponent({
        label: 'Confirm password',
        placeholder: 'Confirm your new password',
        name: 'confirmNewPassword',
        type: 'password',
        onChange: (e: Event) => {
          const target = e.target as HTMLInputElement;
          const value = target.value;
          this.setProps({ confirmNewPassword: value });
          const error = validateInput('password', value);
          this.getChild('ConfirmPasswordInput')?.setProps({ error, value });
        },
      }),
      ChangePasswordButton: new ButtonComponent({
        label: 'Change password',
        variant: 'primary',
        onClick: (e: Event) => {
          e.preventDefault();
          const oldPasswordError = validateInput(
            'password',
            this.props.oldPassword
          );
          const newPasswordError = validateInput(
            'password',
            this.props.newPassword
          );
          const confirmPasswordError = validateInput(
            'password',
            this.props.confirmNewPassword
          );

          this.getChild('OldPasswordInput')?.setProps({
            error: oldPasswordError,
          });
          this.getChild('NewPasswordInput')?.setProps({
            error: newPasswordError,
          });
          this.getChild('ConfirmPasswordInput')?.setProps({
            error: confirmPasswordError,
          });

          if (!oldPasswordError && !newPasswordError && !confirmPasswordError) {
            if (this.props.newPassword !== this.props.confirmNewPassword) {
              this.getChild('ConfirmPasswordInput')?.setProps({
                error: 'Passwords do not match',
              });
            }
            console.log('Old Password:', this.props.oldPassword);
            console.log('New Password:', this.props.newPassword);
            console.log('Confirm Password:', this.props.confirmNewPassword);
          }
        },
      }),
      CancelButton: new ButtonComponent({
        label: 'Cancel',
        variant: 'error',
        onClick: (e: Event) => {
          e.preventDefault();
          console.log('Cancel button clicked');
        },
      }),
      BackButton: new BackButtonComponent({
        onClick: () => {
          console.log('Go to previous page');
        },
      }),
    });
  }

  render() {
    return `
        <section class="container-section">
            <div class="password-container">
                <h1>Change password</h1>
                {{{ OldPasswordInput }}}
                {{{ NewPasswordInput }}}
                {{{ ConfirmPasswordInput }}}
                <div class="password-form__actions">
                    {{{ ChangePasswordButton }}}
                    {{{ CancelButton }}}
                </div>
            </div>
        </section>
        {{{ BackButton }}}
        `;
  }
}
