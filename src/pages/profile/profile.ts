import { InputComponent, ButtonComponent, BackButtonComponent } from "../../components";
import Block from "../../core/block";
import { ROUTER } from "../../constants";
import { connect } from "../../helpers/connect";
import { withRouter } from "../../helpers/with-router";
import { logoutUser } from "../../services/auth.service";
import type { AppState } from "../../types";
import type { BlockProps } from "../../core/types";
import { getAvatarUrl } from "../../helpers/get-avatar-url";

interface ProfilePageProps extends BlockProps {
  first_name: string;
  second_name: string;
  display_name: string;
  login: string;
  email: string;
  phone: string;
  avatar: string;
}
class ProfilePage extends Block<ProfilePageProps> {
  constructor(props: ProfilePageProps) {
    super("main", {
      ...props,
      FirstNameInput: new InputComponent({
        label: "First name",
        value: props.first_name,
        readOnly: true,
      }),
      SecondNameInput: new InputComponent({
        label: "Second name",
        value: props.second_name,
        readOnly: true,
      }),
      NicknameInput: new InputComponent({
        label: "Nickname",
        value: props.display_name,
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
          window.router.go(ROUTER.profileUpdate);
        },
      }),
      UpdatePasswordButton: new ButtonComponent({
        label: "Update password",
        variant: "primary",
        onClick: (e: Event) => {
          e.preventDefault();
          window.router.go(ROUTER.password);
        },
      }),
      LogoutButton: new ButtonComponent({
        label: "Logout",
        variant: "error",
        onClick: (e: Event) => {
          e.preventDefault();
          logoutUser();
        },
      }),
      BackButton: new BackButtonComponent({
        onClick: () => {
          window.router.back();
        },
      }),
    });
  }

  componentDidUpdate(oldProps: ProfilePageProps, newProps: ProfilePageProps) {
    if (oldProps.avatar !== newProps.avatar) {
      this.setProps({ avatar: newProps.avatar });
    }
    if (oldProps.first_name !== newProps.first_name) {
      this.getChild("FirstNameInput")?.setProps({ value: newProps.first_name });
    }
    if (oldProps.second_name !== newProps.second_name) {
      this.getChild("SecondNameInput")?.setProps({ value: newProps.second_name });
    }
    if (oldProps.display_name !== newProps.display_name) {
      this.getChild("NicknameInput")?.setProps({ value: newProps.display_name });
    }
    if (oldProps.login !== newProps.login) {
      this.getChild("LoginInput")?.setProps({ value: newProps.login });
    }
    if (oldProps.email !== newProps.email) {
      this.getChild("EmailInput")?.setProps({ value: newProps.email });
    }
    if (oldProps.phone !== newProps.phone) {
      this.getChild("PhoneInput")?.setProps({ value: newProps.phone });
    }

    return true;
  }

  render() {
    return `
        <section class="centered">
            <div class="profile-container border">
                <h1>My profile</h1>
                <div class="profile-avatar">
                    <img src={{avatar}} alt="User Avatar" class="profile-avatar__image"/>
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

const mapStateToProps = (state: AppState) => ({
  first_name: state.user.first_name,
  second_name: state.user.second_name,
  display_name: state.user.display_name,
  login: state.user.login,
  email: state.user.email,
  phone: state.user.phone,
  avatar: getAvatarUrl(state.user.avatar),
});

export default connect(mapStateToProps)(withRouter(ProfilePage));
