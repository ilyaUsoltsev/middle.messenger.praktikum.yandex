import AuthApi from "../api/auth";
import type { CreateUser, LoginRequestData } from "../api/auth.types";
import { ROUTER } from "../constants";

const authApi = new AuthApi();

export const registerUser = async (registerData: CreateUser) => {
  window.store.set({ isLoading: true });
  try {
    await authApi.register(registerData);
    window.router.go(ROUTER.login);
  } catch (responseError) {
    const xhr = responseError as XMLHttpRequest;
    const error = xhr.response ? JSON.parse(xhr.response) : { reason: "Unknown error" };
    window.store.set({ loginError: error.reason });
  } finally {
    window.store.set({ isLoading: false });
  }
};

export const loginUser = async (loginData: LoginRequestData) => {
  window.store.set({ isLoading: true });

  try {
    await authApi.login(loginData);
    window.router.go(ROUTER.messages);
  } catch (responseError) {
    const xhr = responseError as XMLHttpRequest;
    const error = xhr.response ? JSON.parse(xhr.response) : { reason: "Unknown error" };
    window.store.set({ loginError: error.reason });
  } finally {
    window.store.set({ isLoading: false });
  }
};

export const checkLoginUser = async () => {
  window.store.set({ isLoading: true });
  try {
    const user = await authApi.me();
    window.router.go(ROUTER.messages);
    window.store.set({ user });
  } catch (responseError) {
    const xhr = responseError as XMLHttpRequest;
    const error = xhr.response ? JSON.parse(xhr.response) : { reason: "Unknown error" };
    window.store.set({ loginError: error.reason });
  } finally {
    window.store.set({ isLoading: false });
  }
};

export const logoutUser = async () => {
  window.store.set({ isLoading: true });
  try {
    await authApi.logout();
    window.store.set({ user: {} });
    window.router.go(ROUTER.login);
  } catch (responseError) {
    const xhr = responseError as XMLHttpRequest;
    const error = xhr.response ? JSON.parse(xhr.response) : { reason: "Unknown error" };
    window.store.set({ loginError: error.reason });
  } finally {
    window.store.set({ isLoading: false });
  }
};
