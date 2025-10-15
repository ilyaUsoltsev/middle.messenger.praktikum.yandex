import {
  InputComponent,
  ButtonComponent,
  DialogComponent,
  BackButtonComponent,
} from "../../components";
import Block from "../../core/block";
import { validateInput } from "../../helpers/validation";
import type { ProfilePageProps } from "./types";

export default class ProfileEditPage extends Block {
  constructor(props: ProfilePageProps) {
    super("main", {
      updateAvatar: false,
      firstName: props.firstName,
      secondName: props.secondName,
      displayName: props.displayName,
      login: props.login,
      email: props.email,
      phone: props.phone,
      FirstNameInput: new InputComponent({
        label: "First name",
        name: "first_name",
        value: props.firstName,
        onChange: (e: Event) => {
          const target = e.target as HTMLInputElement;
          const value = target.value;
          this.setProps({ firstName: value });
          const error = validateInput("name", value);
          this.getChild("FirstNameInput")?.setProps({ error, value });
        },
      }),
      SecondNameInput: new InputComponent({
        label: "Second name",
        name: "second_name",
        value: props.secondName,
        onChange: (e: Event) => {
          const target = e.target as HTMLInputElement;
          const value = target.value;
          this.setProps({ secondName: value });
          const error = validateInput("name", value);
          this.getChild("SecondNameInput")?.setProps({ error, value });
        },
      }),
      NicknameInput: new InputComponent({
        label: "Nickname",
        name: "display_name",
        value: props.displayName,
        onChange: (e: Event) => {
          const target = e.target as HTMLInputElement;
          const value = target.value;
          this.setProps({ displayName: value });
          const error = validateInput("name", value);
          this.getChild("NicknameInput")?.setProps({ error, value });
        },
      }),
      LoginInput: new InputComponent({
        label: "Login",
        name: "login",
        value: props.login,
        onChange: (e: Event) => {
          const target = e.target as HTMLInputElement;
          const value = target.value;
          this.setProps({ login: value });
          const error = validateInput("login", value);
          this.getChild("LoginInput")?.setProps({ error, value });
        },
      }),
      EmailInput: new InputComponent({
        label: "Email",
        name: "email",
        value: props.email,
        onChange: (e: Event) => {
          const target = e.target as HTMLInputElement;
          const value = target.value;
          this.setProps({ email: value });
          const error = validateInput("email", value);
          this.getChild("EmailInput")?.setProps({ error, value });
        },
      }),
      PhoneInput: new InputComponent({
        label: "Phone",
        name: "phone",
        value: props.phone,
        onChange: (e: Event) => {
          const target = e.target as HTMLInputElement;
          const value = target.value;
          this.setProps({ phone: value });
          const error = validateInput("phone", value);
          this.getChild("PhoneInput")?.setProps({ error, value });
        },
      }),
      ChangeAvatarButton: new ButtonComponent({
        label: "Change avatar",
        variant: "secondary",
        onClick: (e: Event) => {
          e.preventDefault();
          console.log("Change avatar clicked");
          this.setProps({ updateAvatar: true });
        },
      }),
      SaveButton: new ButtonComponent({
        label: "Save",
        variant: "primary",
        onClick: () => {
          const firstNameError = validateInput("name", this.props.firstName);
          const secondNameError = validateInput("name", this.props.secondName);
          const displayNameError = validateInput("name", this.props.displayName);
          const loginError = validateInput("login", this.props.login);
          const emailError = validateInput("email", this.props.email);
          const phoneError = validateInput("phone", this.props.phone);

          this.getChild("FirstNameInput")?.setProps({ error: firstNameError });
          this.getChild("SecondNameInput")?.setProps({
            error: secondNameError,
          });
          this.getChild("NicknameInput")?.setProps({ error: displayNameError });
          this.getChild("LoginInput")?.setProps({ error: loginError });
          this.getChild("EmailInput")?.setProps({ error: emailError });
          this.getChild("PhoneInput")?.setProps({ error: phoneError });

          if (
            !firstNameError &&
            !secondNameError &&
            !displayNameError &&
            !loginError &&
            !emailError &&
            !phoneError
          ) {
            console.log("Profile data:", {
              firstName: this.props.firstName,
              secondName: this.props.secondName,
              displayName: this.props.displayName,
              login: this.props.login,
              email: this.props.email,
              phone: this.props.phone,
            });
          }
        },
      }),
      CancelButton: new ButtonComponent({
        label: "Cancel",
        variant: "error",
        onClick: () => {
          console.log("Cancel button clicked");
        },
      }),
      UpdateAvatarDialog: new DialogComponent({
        title: "Change avatar",
        Body: new InputComponent({
          type: "file",
          name: "avatar",
          label: "Choose avatar",
        }),
        onConfirm: () => {
          console.log("Avatar changed");
          this.setProps({ updateAvatar: false });
        },
        onCancel: () => {
          console.log("Avatar change canceled");
          this.setProps({ updateAvatar: false });
        },
      }),
      BackButton: new BackButtonComponent({
        onClick: () => {
          console.log("Go to previous page");
        },
      }),
    });
  }

  render() {
    return `
        <section class="container-section">
            <div class="profile-container">
                <h1>Edit profile</h1>
                <div class="profile-avatar">
                    <img src="./avatar.png" alt="User Avatar" class="profile-avatar__image"/>
                    {{{ ChangeAvatarButton }}}
                </div>
                {{{ FirstNameInput }}}
                {{{ SecondNameInput }}}
                {{{ NicknameInput }}}
                {{{ LoginInput }}}
                {{{ EmailInput }}}
                {{{ PhoneInput }}}
                <div class="profile-form__actions">
                    {{{ SaveButton }}}
                    {{{ CancelButton }}}
                </div>
            </div>
        </section>
        {{#if updateAvatar}}
            {{{ UpdateAvatarDialog }}}
        {{/if}}
        {{{ BackButton }}}
        `;
  }
}
