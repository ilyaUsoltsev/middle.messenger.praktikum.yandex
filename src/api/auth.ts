import HttpClient from "../core/http";
import type { CreateUser, LoginRequestData, SignUpResponse, UserDTO } from "./auth.types";

const authApi = new HttpClient("/auth");

export default class AuthApi {
  async register(data: CreateUser): Promise<SignUpResponse> {
    return JSON.parse((await authApi.post("/signup", { data })).response) as SignUpResponse;
  }

  async login(data: LoginRequestData): Promise<void> {
    return (await authApi.post("/signin", { data })).response;
  }

  async me(): Promise<UserDTO> {
    return JSON.parse((await authApi.get("/user")).response) as UserDTO;
  }

  async logout(): Promise<void> {
    return (await authApi.post("/logout")).response;
  }
}
