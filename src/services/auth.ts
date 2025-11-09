import AuthApi from "../api/auth";
import type { CreateUser, LoginRequestData } from "../api/types";
import { ROUTER } from "../constants";

const authApi = new AuthApi();

export const registerUser = async (registerData: CreateUser) => {
  window.store.set({ isLoading: true });
  try {
    await authApi.register(registerData);
    window.router.go(ROUTER.login);
  } catch (responseError) {
    const error = await (responseError as Response).json();
    window.store.set({ loginError: error.reason });
  } finally {
    window.store.set({ isLoading: false });
  }
};

export const loginUser = async (loginData: LoginRequestData) => {
  window.store.set({ isLoading: true });

  try {
    await authApi.login(loginData);
    window.router.go(ROUTER.chats);
  } catch (responseError) {
    const error = await (responseError as Response).json();
    window.store.set({ loginError: error.reason });
  } finally {
    window.store.set({ isLoading: false });
  }
};

export const checkLoginUser = async () => {
  window.store.set({ isLoading: true });
  try {
    const user = await authApi.me();
    window.router.go(ROUTER.chats);
    window.store.set({ user });
  } catch (responseError) {
    const error = await (responseError as Response).json();
    window.store.set({ loginError: error.reason });
  } finally {
    window.store.set({ isLoading: false });
  }
};
