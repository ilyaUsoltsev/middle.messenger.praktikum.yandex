export type SearchUserRequest = {
  login: string;
};

export type SearchUserResponse = Array<{
  id: number;
  first_name: string;
  second_name: string;
  display_name: string;
  phone: string;
  login: string;
  avatar: string;
  email: string;
}>;
