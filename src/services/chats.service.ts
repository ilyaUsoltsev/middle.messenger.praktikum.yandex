import ChatsApi from "../api/chats";
import { searchUserByLogin } from "./user.service";

const chatsApi = new ChatsApi();

export const createChat = async (title: string) => {
  window.store.set({ isLoading: true });
  try {
    await chatsApi.createChat({ title });
    const responseGetLastChat = await chatsApi.getChats({ limit: 1, offset: 0, title: title });
    const chats = window.store.getState().chats || [];
    console.log(responseGetLastChat, "responseGetLastChat");
    window.store.set({ chats: [responseGetLastChat[0], ...chats] });
  } catch (responseError) {
    const error = await (responseError as Response).json();
    window.store.set({ error: error.reason });
  } finally {
    window.store.set({ isLoading: false });
  }
};

export const getChats = async () => {
  window.store.set({ isLoading: true });
  try {
    const chats = await chatsApi.getChats();
    window.store.set({ chats });
  } catch (responseError) {
    const error = await (responseError as Response);
    console.log(error, "error in getChats");
    window.store.set({ error: error.reason });
  } finally {
    window.store.set({ isLoading: false });
  }
};

export const setSelectedChatId = (chatId: number) => {
  window.store.set({ selectedChatId: chatId });
};

export const deleteChat = async (chatId: number) => {
  window.store.set({ isLoading: true });
  try {
    await chatsApi.deleteChat(chatId);
    const chats = window.store.getState().chats || [];
    const updatedChats = chats.filter((chat) => chat.id !== chatId);
    window.store.set({ chats: updatedChats, selectedChatId: null });
  } catch (responseError) {
    window.store.set({ error: error.reason });
  } finally {
    window.store.set({ isLoading: false });
  }
};

export const addUserToChat = async (chatId: number, userLogin: string) => {
  window.store.set({ isLoading: true });
  try {
    const foundUsers = await searchUserByLogin(userLogin);
    await chatsApi.addUserToChat(chatId, foundUsers[0].id);
    const chatUsers = await chatsApi.getChatUsers(chatId);
    window.store.set({ selectedChatUsers: chatUsers });
  } catch (responseError) {
    console.log(responseError, "error in addUserToChat");
    // window.store.set({ error: error.reason });
  } finally {
    window.store.set({ isLoading: false });
  }
};

export const getChatUsers = async (chatId: number) => {
  window.store.set({ isLoading: true });
  try {
    const chatUsers = await chatsApi.getChatUsers(chatId);
    window.store.set({ selectedChatUsers: chatUsers });
  } catch (responseError) {
    const error = await (responseError as Response).json();
    window.store.set({ error: error.reason });
  } finally {
    window.store.set({ isLoading: false });
  }
};
