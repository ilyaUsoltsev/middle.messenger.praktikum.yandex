import {
  InputComponent,
  ButtonComponent,
  DialogComponent,
  BackButtonComponent,
  FormComponent,
} from "../../components";
import { ProfileFormComponent } from "../../components/profile-form";
import Block from "../../core/block";
import type { BlockProps } from "../../core/types";
import { getFormData } from "../../helpers/get-form-data";
import { validateInput } from "../../helpers/validation";
import type { ProfilePageProps } from "./types";

interface ProfileEditState extends BlockProps {
  updateAvatar: boolean;
}

export default class ProfileEditPage extends Block<ProfileEditState> {
  constructor(props: ProfilePageProps) {
    super("main", {
      updateAvatar: false,
      ProfileForm: new FormComponent({
        onSubmitButtonLabel: "Save",
        Body: new ProfileFormComponent({ ...props }),
        onSubmit: (e: Event) => {
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

          console.log("Form submitted with data:", data);
        },
        AdditionalButtons: new ButtonComponent({
          label: "Cancel",
          variant: "error",
          onClick: () => {
            console.log("Cancel button clicked");
          },
        }),
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
        <section class="centered">
          <div class="border">
          <h1>Edit Profile</h1>
            <div class="profile-avatar">
                <img src="./avatar.png" alt="User Avatar" class="profile-avatar__image"/>
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
