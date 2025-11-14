import {
  InputComponent,
  ButtonComponent,
  DialogComponent,
  BackButtonComponent,
  FormComponent,
} from "../../components";
import { ProfileFormComponent } from "../../components/profile-form";
import Block from "../../core/block";
import { connect } from "../../helpers/connect";
import { getFormData } from "../../helpers/get-form-data";
import { validateInput } from "../../helpers/validation";
import { withRouter } from "../../helpers/with-router";
import { updateUserProfile, updateUserAvatar } from "../../services/user.service";
import type { AppState } from "../../types";
import type { ProfilePageProps } from "./types";

interface ProfileEditState extends ProfilePageProps {
  updateAvatar: boolean;
  avatar: string;
}

class ProfileEditPage extends Block<ProfileEditState> {
  constructor(props: ProfilePageProps) {
    super("main", {
      ...props,
      updateAvatar: false,
      ProfileForm: new FormComponent({
        onSubmitButtonLabel: "Save",
        Body: new ProfileFormComponent({ ...props }),
        onSubmit: async (e: SubmitEvent) => {
          e.preventDefault();
          const data = getFormData(e);
          const { first_name, second_name, display_name, login, email, phone } = data;
          const fnError = validateInput("name", first_name);
          const snError = validateInput("name", second_name);
          const dnError = validateInput("name", display_name);
          const loginError = validateInput("login", login);
          const emailError = validateInput("email", email);
          const phoneError = validateInput("phone", phone);
          const hasErrors = fnError || snError || dnError || loginError || emailError || phoneError;

          if (hasErrors) {
            this.getChild("ProfileForm")?.setProps({
              error: "Check inputs format",
            });
            return;
          } else {
            this.getChild("ProfileForm")?.setProps({ error: "" });
          }

          try {
            await updateUserProfile({
              first_name,
              second_name,
              display_name,
              login,
              email,
              phone,
            });
          } catch (error) {
            console.error("Failed to update profile:", error);
            this.getChild("ProfileForm")?.setProps({
              error: "Failed to update profile. Please try again.",
            });
          }
        },
        AdditionalButtons: new ButtonComponent({
          label: "Cancel",
          variant: "error",
          onClick: () => {
            window.router.back();
          },
        }),
      }),
      ChangeAvatarButton: new ButtonComponent({
        label: "Change avatar",
        variant: "secondary",
        onClick: (e: Event) => {
          e.preventDefault();
          this.setProps({ updateAvatar: true });
        },
      }),
      UpdateAvatarDialog: new DialogComponent({
        title: "Change avatar",
        Body: new InputComponent({
          type: "file",
          name: "avatar",
          label: "Choose avatar",
          accept: "image/jpeg,image/jpg,image/png,image/gif,image/webp",
        }),
        onConfirm: async () => {
          const input = this.getChild("UpdateAvatarDialog")
            ?.getChild("Body")
            ?.getContent()
            ?.querySelector('input[type="file"]') as HTMLInputElement;
          const file = input?.files?.[0];

          if (!file) {
            console.error("No file selected");
            return;
          }

          try {
            await updateUserAvatar(file);
            this.setProps({ updateAvatar: false });
          } catch (error) {
            console.error("Failed to update avatar:", error);
          }
        },
        onCancel: () => {
          this.setProps({ updateAvatar: false });
        },
      }),
      BackButton: new BackButtonComponent({
        onClick: () => {
          window.router.back();
        },
      }),
    });
  }

  render() {
    return `
        <section class="centered">
          <div class="border">
          <h1>Edit Profile</h1>
            <div class="profile-avatar">
                <img src={{get_avatar_url avatar}} alt="User Avatar" class="profile-avatar__image"/>
                {{{ ChangeAvatarButton }}}
            </div>
            {{{ ProfileForm }}}
          </div>
        </section>
        {{#if updateAvatar}}
            {{{ UpdateAvatarDialog }}}
        {{/if}}
        {{{ BackButton }}}
        `;
  }
}

const mapStateToProps = (state: AppState) => {
  return {
    first_name: state.user.first_name || "",
    second_name: state.user.second_name || "",
    display_name: state.user.display_name || "",
    login: state.user.login || "",
    email: state.user.email || "",
    phone: state.user.phone || "",
    avatar: state.user.avatar || "",
  };
};

export default connect(mapStateToProps)(withRouter(ProfileEditPage));
