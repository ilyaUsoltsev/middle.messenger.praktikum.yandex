import AuthApi from "../api/auth";
import type { CreateUser, LoginRequestData } from "../api/auth.types";
import { ROUTER } from "../constants";
import { extractError } from "../helpers/extract-error";

const authApi = new AuthApi();

export const registerUser = async (registerData: CreateUser) => {
  window.store.set({ isLoading: true });
  try {
    await authApi.register(registerData);
    window.router.go(ROUTER.login);
  } catch (responseError) {
    window.store.set({ loginError: extractError(responseError) });
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
    window.store.set({ loginError: extractError(responseError) });
  } finally {
    window.store.set({ isLoading: false });
  }
};

export const checkLoginUser = async () => {
  window.store.set({ isLoading: true });
  try {
    const user = await authApi.me();
    window.store.set({ user });

    // Only redirect to messages if user is on login/register pages
    const currentPath = window.location.pathname;
    if (currentPath === ROUTER.login || currentPath === ROUTER.register || currentPath === ROUTER.main) {
      window.router.go(ROUTER.messages);
    }
  } catch (responseError) {
    window.store.set({ loginError: extractError(responseError) });
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
    window.store.set({ loginError: extractError(responseError) });
  } finally {
    window.store.set({ isLoading: false });
  }
};
