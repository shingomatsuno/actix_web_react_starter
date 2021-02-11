//http://react-toolbox.io/#/
// TODO react material-uiからreact-toolboxに変更する

import React, { useEffect, useState } from "react";
import { Route, Redirect, useLocation } from "react-router-dom";
import CssBaseline from "@material-ui/core/CssBaseline";
import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";
import "./App.css";
import Header from "./components/organisms/header";
import Drawer from "./components/organisms/drawer";
import Top from "./pages/top";
import Signup from "./pages/signup";
import Articles from "./pages/articles";
import Home from "./pages/home";
import Login from "./pages/login";
import * as auth from "./api/auth";
import { RootState } from "./store/rootReducer";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { setUser } from "./store/modules/userModule";
import { setLoading } from "./store/modules/loadingModule";
import Alert from "./components/molecules/alert";
import { closeAlert } from "./store/modules/alertModule";
import Snackbar from "./components/molecules/snackbar";
import { closeSnack } from "./store/modules/snackbarModule";

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

// 認証中は遷移できないroute
const UnauthRoute = ({ component, ...props }: any) => {
  const { user } = useSelector((state: RootState) => state.user);
  return (
    <Route
      {...props}
      component={
        !user
          ? component
          : ({ location }: any) => (
              <Redirect
                to={{
                  pathname: "/home",
                  state: { from: location },
                }}
              />
            )
      }
    />
  );
};
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      display: "flex",
    },
    content: {
      flexGrow: 1,
      padding: theme.spacing(3),
      marginTop: "65px",
    },
  })
);

export default function App() {
  const classes = useStyles();
  // パスを取得
  const location = useLocation();
  const path = location.pathname;
  // ログイン情報
  const { user } = useSelector((state: RootState) => state.user);
  // 初期化フラグ
  const [init, setInit] = useState<boolean>(false);
  const dispatch = useDispatch();

  const initialize = async () => {
    // 初期処理
    dispatch(setLoading(true));
    await checkLogin();
    dispatch(setLoading(false));
    setInit(true);
  };

  // ログインチェック
  const checkLogin = async () => {
    const user = await auth.get().catch((e) => {
      return null;
    });
    dispatch(setUser(user));
  };

  useEffect(() => {
    // 認証チェック
    initialize();
  }, []);

  useEffect(() => {
    // ページに遷移したとき

    return () => {
      // ページから離れるとき
      // アラートが開いていたら閉じる
      dispatch(closeAlert());
      // スナックバーが開いていたら閉じる
      dispatch(closeSnack());
    };
  });

  return (
    <div className={classes.root}>
      <CssBaseline />
      <Snackbar />
      <Header />
      {user && path !== "/" && <Drawer />}
      {init && (
        <main className={classes.content}>
          <Alert />
          <React.Fragment>
            <Route exact path="/" component={Top} />
            <UnauthRoute path="/login" component={Login} />
            <UnauthRoute exact path="/signup" component={Signup} />
            <ProtectedRoute path="/articles" component={Articles} />
            <ProtectedRoute path="/home" component={Home} />
          </React.Fragment>
        </main>
      )}
    </div>
  );
}
