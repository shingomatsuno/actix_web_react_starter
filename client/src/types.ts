import { Interface } from "readline";

// xxxParam リクエストパラメータ
export type LoginParam = {
  email: string;
  password: string;
};

export type User = {
  id: number;
  name: string;
};
