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
      userId: number;
      content: string;
      timestamp: string;
    }>
  >[];
  loginError?: string;
  registerError?: string;
  selectedChatId: number | null;
}
