import { Link } from "react-router-dom";
export const Top = () => {
  return (
    <div id="top">
      <p>
        ↓のリンクはログインしないと入れません。ログインしてない場合はログイン画面に遷移します。
      </p>
      <Link to="/articles">Articles</Link>
    </div>
  );
};
