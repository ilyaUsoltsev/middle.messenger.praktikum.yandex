import UserApi from "../api/user";
import type { UpdateUserProfileRequest, ChangePasswordRequest } from "../api/user.types";
import { ROUTER } from "../constants";

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

export const updateUserProfile = async (profileData: UpdateUserProfileRequest) => {
  window.store.set({ isLoading: true });
  try {
    const user = await userApi.updateProfile(profileData);
    window.store.set({ user });
    window.router.go(ROUTER.profile);
  } catch (responseError) {
    const error = await (responseError as Response).json();
    window.store.set({ profileError: error.reason });
    throw error;
  } finally {
    window.store.set({ isLoading: false });
  }
};

export const updateUserAvatar = async (file: File) => {
  window.store.set({ isLoading: true });
  try {
    const formData = new FormData();
    formData.append("avatar", file);
    const user = await userApi.updateAvatar(formData);
    window.store.set({ user });
  } catch (responseError) {
    const error = await (responseError as Response).json();
    window.store.set({ profileError: error.reason });
    throw error;
  } finally {
    window.store.set({ isLoading: false });
  }
};

export const changeUserPassword = async (passwordData: ChangePasswordRequest) => {
  window.store.set({ isLoading: true });
  try {
    await userApi.changePassword(passwordData);
    window.router.go(ROUTER.profile);
  } catch (responseError) {
    const error = await (responseError as Response).json();
    window.store.set({ profileError: error.reason });
    throw error;
  } finally {
    window.store.set({ isLoading: false });
  }
};
