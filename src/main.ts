import "./style.css";
import * as Pages from "./pages";
import { Store, StoreEvents } from "./core/store";
import { APP_ROOT_ELEMENT, ROUTER } from "./constants";
import Router from "./core/router";
import type { AppState } from "./types";
import { registerHandlebarsHelpers } from "./core/handlebars";
import { checkLoginUser } from "./services/auth.service";

registerHandlebarsHelpers();

window.store = new Store({
  isLoading: false,
  user: {},
  chats: [],
  selectedChatId: null,
  messages: {},
  error: { code: "", message: "" },
  chatToken: undefined,
});

window.store.on(StoreEvents.Updated, (prevState: AppState, newState: AppState) => {
  console.log("prevState", prevState);
  console.log("newState", newState);
});

window.router = new Router(APP_ROOT_ELEMENT);
window.router
  .use(ROUTER.main, Pages.ChatPage)
  .use(ROUTER.login, Pages.LoginPage)
  .use(ROUTER.register, Pages.RegisterPage)
  .use(ROUTER.chats, Pages.ChatPage)
  .use(ROUTER.profile, Pages.ProfilePage)
  .use(ROUTER.profileUpdate, Pages.ProfileEditPage)
  .use(ROUTER.password, Pages.PasswordPage)
  .use(ROUTER.notFound, Pages.ErrorPage)
  .use(ROUTER.error, Pages.ErrorPage)
  .use("*", Pages.ErrorPage)
  .start();

const checkLogin = async () => {
  try {
    await checkLoginUser();
  } catch (error) {
    console.error("Error fetching current user:", error);
  }
};

checkLogin();
