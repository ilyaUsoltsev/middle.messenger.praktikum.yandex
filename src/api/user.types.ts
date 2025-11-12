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

export type UpdateUserProfileRequest = {
  first_name?: string;
  second_name?: string;
  display_name?: string;
  login?: string;
  email?: string;
  phone?: string;
};

export type UserResponse = {
  id: number;
  first_name: string;
  second_name: string;
  display_name: string;
  phone: string;
  login: string;
  avatar: string;
  email: string;
};

export type ChangePasswordRequest = {
  oldPassword: string;
  newPassword: string;
};
