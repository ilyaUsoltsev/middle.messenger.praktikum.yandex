export const getFormData = (e: Event) => {
  const form = e.target as HTMLFormElement;
  const formData = new FormData(form);
  const data: Record<string, string> = {};
  formData.forEach((value, key) => {
    data[key] = value as string;
  });
  return data;
};
