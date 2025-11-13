export const extractError = (responseError: unknown): string => {
  const xhr = responseError as XMLHttpRequest;
  try {
    const error = xhr.response ? JSON.parse(xhr.response) : { reason: "Unknown error" };
    return error.reason || "Unknown error";
  } catch {
    return "Unknown error";
  }
};

export const extractErrorObject = (responseError: unknown): { code: string; message: string } => {
  const xhr = responseError as XMLHttpRequest;
  try {
    const error = xhr.response ? JSON.parse(xhr.response) : { reason: "Unknown error" };
    return {
      code: String(xhr.status || ""),
      message: error.reason || "Unknown error",
    };
  } catch {
    return {
      code: "",
      message: "Unknown error",
    };
  }
};
