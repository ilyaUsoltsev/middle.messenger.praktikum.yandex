import type { ChatsResponse } from "../../api/Api";

export type Message = {
  text: string;
  time: string;
  isOwn: boolean;
};

export type Chat = ChatsResponse;

export type SelectedChat = Chat | null;

export interface ChatsProps {
  chats: Chat[];
  selectedChat: SelectedChat;
  addUser: boolean;
}
