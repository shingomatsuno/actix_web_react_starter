import { apiClient } from "./apiClient";
import { PostParam, UpdateParam, Post, PostResponse } from "../types/postType";

const PATH = "/posts";

// post登録
export async function regist(param: PostParam): Promise<Post> {
  const res = await apiClient.post<Post>(PATH, param);
  return res.data;
}

// post更新
export async function update(param: UpdateParam): Promise<Post> {
  const res = await apiClient.patch<Post>(PATH, param);
  return res.data;
}

// 取得
export async function get(page: number): Promise<PostResponse> {
  const res = await apiClient.get<PostResponse>(PATH + "?page=" + page);
  return res.data;
}

// １件取得
export async function getOne(id: number): Promise<Post> {
  const res = await apiClient.get<Post>(PATH + "/" + id);
  return res.data;
}
