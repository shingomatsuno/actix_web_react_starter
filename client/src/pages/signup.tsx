import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { RegistParam } from "../types/userType";
import * as api from "../api/users";
import { useDispatch } from "react-redux";
import { setUser } from "../store/modules/userModule";

export default function Signup() {
  useEffect(() => {
    document.title = "サインアップ";
  }, []);
  const dispatch = useDispatch();
  const [form, setForm] = useState<RegistParam>({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });

  const handleChange = (key: string) => (e: any) => {
    setForm({ ...form, [key]: e.target.value });
  };

  const handleClick = async (e: any) => {
    e.preventDefault();
    const user = await api.regist(form).catch((e) => {
      return null;
    });
    if (user) {
      dispatch(setUser(user));
    }
  };
  return (
    <div id="top">
      <p>
        ↓のリンクはログインしないと入れません。ログインしてない場合はログイン画面に遷移します。
      </p>
      <Link to="/articles">Articles</Link>
      <div>
        <div>
          <input
            type="text"
            value={form.name}
            onChange={handleChange("name")}
          />
        </div>
        <div>
          <input
            type="text"
            value={form.email}
            onChange={handleChange("email")}
          />
        </div>
        <div>
          <input
            type="password"
            value={form.password}
            onChange={handleChange("password")}
          />
        </div>
        <div>
          <input
            type="password"
            value={form.password_confirmation}
            onChange={handleChange("password_confirmation")}
          />
        </div>
        <div>
          <button onClick={handleClick}>REGIST</button>
        </div>
      </div>
    </div>
  );
}
