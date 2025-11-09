export type CreateChatRequest = {
  title: string;
};

export type CreateChatResponse = {
  id: number;
};

export type GetChatsRequest = void;

export type GetChatsOptions = {
  offset?: number;
  limit?: number;
  title?: string;
};

export type GetChatsResponse = {
  id: number;
  title: string;
  avatar: string | null;
  unread_count: number;
  created_by: number;
  last_message: {
    user: {
      first_name: string;
      second_name: string;
      avatar: string | null;
      email: string;
      login: string;
      phone: string;
    };
    time: string;
    content: string;
  };
}[];
