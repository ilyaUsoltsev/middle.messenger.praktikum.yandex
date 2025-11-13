import HttpClient from "../core/http";
import type {
  SearchUserRequest,
  SearchUserResponse,
  UpdateUserProfileRequest,
  UserResponse,
  ChangePasswordRequest
} from "./user.types";

const userApi = new HttpClient("/user");

export default class UserApi {
  async searchUser(data: SearchUserRequest) {
    return JSON.parse((await userApi.post("/search", { data })).response) as SearchUserResponse;
  }

  async updateProfile(data: UpdateUserProfileRequest) {
    return JSON.parse((await userApi.put("/profile", { data })).response) as UserResponse;
  }

  async updateAvatar(formData: FormData) {
    return JSON.parse((await userApi.put("/profile/avatar", { data: formData })).response) as UserResponse;
  }

  async changePassword(data: ChangePasswordRequest) {
    return await userApi.put("/password", { data });
  }
}
