// xxxParam リクエストパラメータ

// ログイン
export type LoginParam = {
  email: string;
  password: string;
};

// ユーザー登録
export type RegistParam = {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
};

// ユーザ-情報
export type User = {
  id: number;
  name: string;
  email: String;
};
