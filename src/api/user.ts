import HttpClient from "../core/http";
import type { SearchUserRequest, SearchUserResponse } from "./user.types";

const userApi = new HttpClient("/user");

export default class UserApi {
  async searchUser(data: SearchUserRequest) {
    return JSON.parse((await userApi.post("/search", { data })).response) as SearchUserResponse;
  }
}
