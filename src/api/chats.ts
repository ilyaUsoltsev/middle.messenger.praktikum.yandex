import HttpClient from "../core/http";
import type {
  ChatUser,
  CreateChatRequest,
  CreateChatResponse,
  GetChatsOptions,
  GetChatsResponse,
} from "./chats.types";

const httpClient = new HttpClient("/chats");

export default class ChatsApi {
  async createChat(data: CreateChatRequest) {
    return JSON.parse((await httpClient.post("", { data })).response) as CreateChatResponse;
  }

  async getChats(options?: GetChatsOptions) {
    return JSON.parse((await httpClient.get("", { data: options })).response) as GetChatsResponse;
  }

  async deleteChat(chatId: number) {
    return JSON.parse((await httpClient.delete("", { data: { chatId } })).response);
  }

  async addUserToChat(chatId: number, userId: number) {
    return await httpClient.put("/users", { data: { chatId, users: [userId] } });
  }

  async getChatUsers(chatId: number) {
    return JSON.parse((await httpClient.get(`/${chatId}/users`)).response) as ChatUser[];
  }

  async getChatToken(chatId: number) {
    return JSON.parse((await httpClient.post(`/token/${chatId}`)).response) as { token: string };
  }
}
