import "./style.css";
import * as Pages from "./pages";
import { Store, StoreEvents } from "./core/store";
import { APP_ROOT_ELEMENT, ROUTER } from "./constants";
import Router from "./core/router";
import type { AppState } from "./types";

// const pages: Record<string, Block> = {
//   chats: new Pages.ChatPage({
//     chats: chatsFixture,
//     selectedChat: null,
//     addUser: false,
//   }),
//   chatsSelected: new Pages.ChatPage({
//     chats: chatsFixture,
//     selectedChat: chatsFixture[0],
//     addUser: false,
//   }),
//   error: new Pages.ErrorPage({ code: "404", message: "Page not found" }),
//   login: new Pages.LoginPage(),
//   register: new Pages.RegisterPage(),
//   navigation: new Pages.NavigatePage({
//     pages: [
//       "chats",
//       "error",
//       "login",
//       "register",
//       "navigation",
//       "chatsSelected",
//       "profile",
//       "profileUpdate",
//       "password",
//     ],
//   }),
//   password: new Pages.PasswordPage(),
//   profile: new Pages.ProfilePage({
//     firstName: "John",
//     secondName: "Doe",
//     displayName: "Johnny",
//     login: "johndoe",
//     email: "john.doe@example.com",
//     phone: "+1234567890",
//   }),
//   profileUpdate: new Pages.ProfileEditPage({
//     firstName: "John",
//     secondName: "Doe",
//     displayName: "Johnny",
//     login: "johndoe",
//     email: "john.doe@example.com",
//     phone: "+1234567890",
//   }),
// };

window.store = new Store({
  isLoading: false,
  user: {},
  chats: [],
  selectedChatId: null,
  messages: [],
  error: { code: "", message: "" },
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
