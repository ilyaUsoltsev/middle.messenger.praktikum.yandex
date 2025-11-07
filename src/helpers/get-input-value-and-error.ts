import { validateInput, type ValidationName } from "./validation";

export const getInputValueAndError = (e: Event, validationName: ValidationName) => {
  const value = (e.target as HTMLInputElement).value;
  const error = validateInput(validationName, value);
  return { value, error };
};
