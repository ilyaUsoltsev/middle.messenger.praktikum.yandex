import {
  BackButtonComponent,
  ButtonComponent,
  FormComponent,
  PasswordFormComponent,
} from "../../components";
import Block from "../../core/block";
import type { BlockProps } from "../../core/types";
import { getFormData } from "../../helpers/get-form-data";
import { validateInput } from "../../helpers/validation";
import { changeUserPassword } from "../../services/user.service";

interface PasswordPageState extends BlockProps {
  oldPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

export default class PasswordPage extends Block<PasswordPageState> {
  constructor() {
    super("main", {
      oldPassword: "",
      newPassword: "",
      confirmNewPassword: "",
      PasswordForm: new FormComponent({
        label: "Change Password",
        Body: new PasswordFormComponent(),
        onSubmitButtonLabel: "Save",
        className: "border",
        onSubmit: async (e: SubmitEvent) => {
          e.preventDefault();
          const data = getFormData(e);
          const { oldPassword, newPassword, confirmNewPassword } = data;
          const oldPwrdError = validateInput("password", oldPassword);
          const newPwrdError = validateInput("password", newPassword);
          const confirmPwrdError = validateInput("password", confirmNewPassword);
          const hasErrors = oldPwrdError || newPwrdError || confirmPwrdError;

          if (hasErrors) {
            this.getChild("PasswordForm")?.setProps({
              error: "Check inputs format",
            });
            return;
          } else {
            this.getChild("PasswordForm")?.setProps({ error: "" });
          }

          if (newPassword !== confirmNewPassword) {
            this.getChild("PasswordForm")?.setProps({
              error: "New password and confirmation do not match",
            });
            return;
          }

          try {
            await changeUserPassword({
              oldPassword,
              newPassword,
            });
          } catch (error) {
            console.error("Failed to change password:", error);
            this.getChild("PasswordForm")?.setProps({
              error: "Failed to change password. Please check your old password and try again.",
            });
          }
        },
        AdditionalButtons: new ButtonComponent({
          label: "Cancel",
          variant: "secondary",
          onClick: () => {
            window.router.back();
          },
        }),
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
            {{{ PasswordForm }}}
        </section>
        {{{ BackButton }}}
        `;
  }
}
