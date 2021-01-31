import React, { useState } from "react";
import { Link } from "react-router-dom";
import * as auth from "../api/auth";
import { useDispatch } from "react-redux";
import { setUser } from "../store/modules/userModule";
import { LoginParam } from "../types";

export const Login = () => {
  const dispatch = useDispatch();
  const [form, setForm] = useState<LoginParam>({ login_id: "", password: "" });
  const handleChange = (key: string) => (e: any) => {
    setForm({ ...form, [key]: e.target.value });
  };

  const handleClick = async () => {
    const user = await auth
      .login({ ...form })
      .catch((e) => {
        //error
        return null;
      })
      .finally(() => {
        //
      });
    if (user) {
      // ログイン成功
      dispatch(setUser(user));
    }
  };
  return (
    <div id="login">
      <h1>LOGIN</h1>
      <Link to="/">TOP</Link>
      <div>
        <div>
          <input
            type="text"
            name="email"
            value={form.login_id}
            onChange={handleChange("login_id")}
          ></input>
        </div>
        <div>
          <input
            type="text"
            name="email"
            value={form.password}
            onChange={handleChange("password")}
          ></input>
        </div>
        <div>
          <button onClick={handleClick}>send</button>
        </div>
      </div>
    </div>
  );
};