export type Message = {
  text: string;
  time: string;
  isOwn: boolean;
};

export type Chat = {
  avatar: string;
  name: string;
  time: string;
  lastMessage: string;
  unreadCount?: number;
  isSelected?: boolean;
  messages?: { date: string; messages: Message[] }[];
};

export type SelectedChat = Chat | null;

export interface ChatsProps {
  chats: Chat[];
  selectedChat: SelectedChat;
  addUser: boolean;
}
