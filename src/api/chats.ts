import HttpClient from "../core/http";
import type {
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
}
