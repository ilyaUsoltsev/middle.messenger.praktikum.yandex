import type { ChatUser } from "../api/chats.types";

export interface AppState {
  user: {
    id?: number;
    email?: string;
    name?: string;
    display_name?: string;
    first_name?: string;
    second_name?: string;
    login?: string;
    phone?: string;
    avatar?: string;
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
  profileError?: string;
  selectedChatId: number | null;
  selectedChatUsers?: ChatUser[];
  chatToken?: string;
}
