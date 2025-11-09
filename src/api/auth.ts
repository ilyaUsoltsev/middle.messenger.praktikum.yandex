import HttpClient from "../core/http";
import type { CreateUser, LoginRequestData, SignUpResponse, UserDTO } from "./auth.types";

const authApi = new HttpClient("/auth");

export default class AuthApi {
  async register(data: CreateUser): Promise<SignUpResponse> {
    return authApi.post<SignUpResponse>("/signup", { data });
  }

  async login(data: LoginRequestData): Promise<void> {
    return authApi.post("/signin", { data });
  }

  async me(): Promise<UserDTO> {
    return authApi.get("/user");
  }

  async logout(): Promise<void> {
    return authApi.post("/logout");
  }
}
