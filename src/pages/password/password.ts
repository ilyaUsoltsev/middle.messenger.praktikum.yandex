import {
  BackButtonComponent,
  ButtonComponent,
  FormComponent,
  PasswordFormComponent,
} from "../../components";
import Block from "../../core/block";
import { getFormData } from "../../helpers/get-form-data";
import { validateInput } from "../../helpers/validation";

export default class PasswordPage extends Block {
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
        onSubmit: (e: Event) => {
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
          console.log("Form submitted with data:", data);
        },
        AdditionalButtons: new ButtonComponent({
          label: "Cancel",
          variant: "secondary",
          onClick: () => {
            console.log("Cancel button clicked");
          },
        }),
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
            {{{ PasswordForm }}}
        </section>
        {{{ BackButton }}}
        `;
  }
}
