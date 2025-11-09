import ChatsApi from "../api/chats";

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
    const error = await (responseError as Response).json();
    window.store.set({ error: error.reason });
  } finally {
    window.store.set({ isLoading: false });
  }
};
