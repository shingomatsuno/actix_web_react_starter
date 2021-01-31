import { apiClient } from "./apiClient";
import { User, LoginParam } from "../types";
import axios from "axios";

const PATH = "http://localhost:5000/api/auth";

// ログインユーザを取得
export async function get(): Promise<User | null> {
  try {
    const res = await axios.get<User>(PATH, { withCredentials: true });
    console.log(res);
  } catch (e) {
    console.log(e);
  }

  return null;
}

// ログイン
export async function login(param: LoginParam): Promise<User | null> {
  try {
    const res = await apiClient.post<User>(PATH, param, {
      withCredentials: true,
    });
    return res.data;
    console.log(res);
  } catch (e) {
    console.log(e);
  }

  return null;
}

// ログアウト
export async function logout(): Promise<void> {
  await apiClient.delete(PATH);
}
