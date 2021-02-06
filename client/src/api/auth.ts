import { apiClient } from "./apiClient";
import { User, LoginParam } from "../types/userType";

const PATH = "/auth";

// ログインユーザを取得
export async function get(): Promise<User> {
  const res = await apiClient.get<User>(PATH);
  return res.data;
}

// ログイン
export async function login(param: LoginParam): Promise<User> {
  const res = await apiClient.post<User>(PATH, param);
  return res.data;
}

// ログアウト
export async function logout(): Promise<void> {
  await apiClient.delete(PATH);
}
