export type ValidationName =
  | "name"
  | "login"
  | "email"
  | "password"
  | "phone"
  | "message"
  | "chat_title"
  | "user_login";

export const validateInput = (name: ValidationName, value: string): string | null => {
  switch (name) {
    case "name":
      if (!/^[A-ZА-ЯЁ][A-Za-zА-ЯЁа-яё-]*$/.test(value)) {
        return "Invalid name format";
      }
      break;
    case "login":
      if (!/^(?=.*[A-Za-z])[A-Za-z0-9_-]{3,20}$/.test(value)) {
        return "Invalid login format";
      }
      break;
    case "email":
      if (!/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(value)) {
        return "Invalid email format";
      }
      break;
    case "password":
      if (!/^(?=.*[A-Z])(?=.*\d).{8,40}$/.test(value)) {
        return "Invalid password format";
      }
      break;
    case "phone":
      if (!/^\+?\d{10,15}$/.test(value)) {
        return "10-15 digits, may start with plus";
      }
      break;
    case "message":
    case "chat_title":
    case "user_login":
      if (!value.trim()) {
        return "Cannot be empty";
      }
      break;
  }
  return null;
};
