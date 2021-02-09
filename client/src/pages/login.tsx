import React, { useState } from "react";
import Grid from "@material-ui/core/Grid";
import Container from "@material-ui/core/Container";
import TextField from "@material-ui/core/TextField";
import * as auth from "../api/auth";
import { useDispatch } from "react-redux";
import { setUser } from "../store/modules/userModule";
import { LoginParam } from "../types/userType";
import Btn from "../components/atoms/btn";
import { RootState } from "../store/rootReducer";
import { useHistory } from "react-router-dom";
import { setLoading } from "../store/modules/loadingModule";
import { useSelector } from "react-redux";

export default function Login() {
  const history = useHistory();
  const { loading } = useSelector((state: RootState) => state.loading);

  const dispatch = useDispatch();
  const [form, setForm] = useState<LoginParam>({ email: "", password: "" });

  const handleChange = (key: string) => (e: any) => {
    setForm({ ...form, [key]: e.target.value });
  };

  const handleClick = async () => {
    dispatch(setLoading(true));
    const user = await auth
      .login({ ...form })
      .catch((e) => {
        //error
        return null;
      })
      .finally(() => {
        dispatch(setLoading(false));
      });
    if (user) {
      // ログイン成功
      dispatch(setUser(user));
      history.push("/home");
    }
  };
  return (
    <React.Fragment>
      <Container maxWidth="xs">
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <h1>Login</h1>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              name="email"
              label="email"
              value={form.email}
              onChange={handleChange("email")}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              name="password"
              type="password"
              label="password"
              value={form.password}
              onChange={handleChange("password")}
            />
          </Grid>
          <Grid item xs={4}>
            <Btn title="SEND" loading={loading} onClick={handleClick} />
          </Grid>
        </Grid>
      </Container>
    </React.Fragment>
  );
}
