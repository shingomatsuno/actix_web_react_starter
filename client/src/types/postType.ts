// xxxParam リクエストパラメータ

// post登録
export type PostParam = {
  title: string;
  body: string;
};

// post更新
export type UpdateParam = {
  id: number;
  title: string;
  body: string;
};

// post
export type Post = {
  id: number;
  title: string;
  body: string;
};

export type PostResponse = {
  data: Array<Post>;
  total: number;
};
