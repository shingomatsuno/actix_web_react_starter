// xxxParam リクエストパラメータ

// ログイン
export type LoginParam = {
  email: string;
  password: string;
};

// ユーザー登録
export type RegistParam = {
  name: String;
  email: String;
  password: String;
  password_confirmation: String;
};

// ユーザ-情報
export type User = {
  id: number;
  name: string;
  email: String;
};
