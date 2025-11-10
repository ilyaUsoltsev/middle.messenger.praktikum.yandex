import type { ChatUser } from "../api/chats.types";

export interface AppState {
  user: {
    id?: number;
    email?: string;
    name?: string;
    displayName?: string;
    firstName?: string;
    secondName?: string;
    login?: string;
    phone?: string;
  };
  chats?: Array<{
    id: number;
    title: string;
    avatar: string | null;
  }>;
  selectedChat?: number | null;
  isLoading?: boolean;
  error: {
    code: string;
    message: string;
  };
  messages?: Record<
    number,
    Array<{
      id: number;
      user_id: number;
      content: string;
      time: string;
      type: string;
    }>
  >;
  loginError?: string;
  registerError?: string;
  selectedChatId: number | null;
  selectedChatUsers?: ChatUser[];
  chatToken?: string;
}
