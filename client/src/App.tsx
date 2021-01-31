import React, { Component, useEffect, useState } from "react";
import { Route, Redirect } from "react-router-dom";
import "./App.css";
import { Header } from "./components/header";
import { Top } from "./pages/top";
import { Articles } from "./pages/articles";
import { Login } from "./pages/login";
import * as auth from "./api/auth";
import { useSelector } from "react-redux";
import { RootState } from "./store/rootReducer";
import { useDispatch } from "react-redux";
import { setUser } from "./store/modules/userModule";

// 認証が必要なroute
const ProtectedRoute = ({ component, ...props }: any) => {
  const { user } = useSelector((state: RootState) => state.user);

  return (
    <Route
      {...props}
      component={
        user
          ? component
          : ({ location }: any) => (
              <Redirect
                to={{
                  pathname: "/login",
                  state: { from: location },
                }}
              />
            )
      }
    />
  );
};

export const App = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // 認証チェック
    const checkLogin = async () => {
      const user = await auth.get().catch((e) => {
        return null;
      });
      dispatch(setUser(user));
      setLoading(false);
    };
    checkLogin();
  }, []);

  if (loading) {
    return <div>...Loading</div>;
  }
  return (
    <div>
      <Header />
      <div id="container">
        <Route exact path="/" component={Top} />
        <ProtectedRoute path="/articles" component={Articles} />
        <Route path="/login" component={Login} />
      </div>
    </div>
  );
};
