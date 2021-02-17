import { apiClient } from "./apiClient";
import { RegistParam, UpdateParam, User } from "../types/userType";

const PATH = "/users";

// ユーザ登録
export async function regist(param: RegistParam): Promise<User> {
  const res = await apiClient.post<User>(PATH, param);
  return res.data;
}

// ユーザ更新
export async function update(param: UpdateParam): Promise<User> {
  const res = await apiClient.patch<User>(PATH, param);
  return res.data;
}
