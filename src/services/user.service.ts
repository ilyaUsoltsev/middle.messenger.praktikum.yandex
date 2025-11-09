import UserApi from "../api/user";

const userApi = new UserApi();

export const searchUserByLogin = async (login: string) => {
  try {
    const response = await userApi.searchUser({ login });
    return response;
  } catch (error) {
    console.error("Error searching user by login:", error);
    throw error;
  }
};
