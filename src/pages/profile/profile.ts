import { InputComponent, ButtonComponent, BackButtonComponent } from "../../components";
import Block from "../../core/block";
import type { ProfilePageProps } from "./types";

export default class ProfilePage extends Block<ProfilePageProps> {
  constructor(props: ProfilePageProps) {
    super("main", {
      FirstNameInput: new InputComponent({
        label: "First name",
        value: props.firstName,
        readOnly: true,
      }),
      SecondNameInput: new InputComponent({
        label: "Second name",
        value: props.secondName,
        readOnly: true,
      }),
      NicknameInput: new InputComponent({
        label: "Nickname",
        value: props.displayName,
        readOnly: true,
      }),
      LoginInput: new InputComponent({
        label: "Login",
        value: props.login,
        readOnly: true,
      }),
      EmailInput: new InputComponent({
        label: "Email",
        value: props.email,
        readOnly: true,
      }),
      PhoneInput: new InputComponent({
        label: "Phone",
        value: props.phone,
        readOnly: true,
      }),
      ChangeProfileButton: new ButtonComponent({
        label: "Change profile",
        variant: "primary",
        onClick: (e: Event) => {
          e.preventDefault();
          console.log("Change profile clicked");
        },
      }),
      UpdatePasswordButton: new ButtonComponent({
        label: "Update password",
        variant: "primary",
        onClick: (e: Event) => {
          e.preventDefault();
          console.log("Navigate to password update page");
        },
      }),
      LogoutButton: new ButtonComponent({
        label: "Logout",
        variant: "error",
        onClick: (e: Event) => {
          e.preventDefault();
          console.log("Logout clicked");
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
        <section class="centered">
            <div class="profile-container border">
                <h1>My profile</h1>
                <div class="profile-avatar">
                    <img src="./avatar.png" alt="User Avatar" class="profile-avatar__image"/>
                </div>
                {{{ FirstNameInput }}}
                {{{ SecondNameInput }}}
                {{{ NicknameInput }}}
                {{{ LoginInput }}}
                {{{ EmailInput }}}
                {{{ PhoneInput }}}
                <div class="profile-form__actions">
                  {{{ ChangeProfileButton }}}
                  {{{ UpdatePasswordButton }}}
                  {{{ LogoutButton }}}
                </div>
            </div>
        </section>
        {{{ BackButton }}}
        `;
  }
}
