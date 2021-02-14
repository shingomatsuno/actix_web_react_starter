import { apiClient } from "./apiClient";
import { RegistParam, UpdateParam, User } from "../types/userType";

const PATH = "/users";

export async function regist(param: RegistParam): Promise<User> {
  const res = await apiClient.post<User>(PATH, param);
  return res.data;
}

export async function update(param: UpdateParam): Promise<User> {
  const res = await apiClient.put<User>(PATH, param);
  return res.data;
}
