import { Interface } from "readline";

// xxxParam リクエストパラメータ
export type LoginParam = {
  login_id: string;
  password: string;
};

export type User = {
  id: number;
  name: string;
};
