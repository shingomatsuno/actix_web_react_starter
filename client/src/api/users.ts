import { apiClient } from "./apiClient";
import { RegistParam, User } from "../types/userType";

const PATH = "/users";

export async function regist(param: RegistParam): Promise<User> {
  const res = await apiClient.post<User>(PATH, param);
  return res.data;
}
