import Grid from "@material-ui/core/Grid";
import Container from "@material-ui/core/Container";
import TextField from "@material-ui/core/TextField";
import { useState, useEffect } from "react";
import { RegistParam } from "../types/userType";
import * as api from "../api/users";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../store/modules/userModule";
import { RootState } from "../store/rootReducer";
import { setLoading } from "../store/modules/loadingModule";
import Button from "../components/atoms/button";
import { useHistory } from "react-router-dom";

export default function Signup() {
  useEffect(() => {
    document.title = "サインアップ";
  }, []);
  const history = useHistory();
  const dispatch = useDispatch();
  const { loading } = useSelector((state: RootState) => state.loading);

  const [form, setForm] = useState<RegistParam>({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });

  const [errors, setErrors] = useState<any>({});

  const handleChange = (key: string) => (e: any) => {
    setForm({ ...form, [key]: e.target.value });
  };

  const handleClick = async () => {
    // 会員登録
    dispatch(setLoading(true));
    const user = await api
      .regist(form)
      .catch((e) => {
        setErrors({ ...e.response.data });
      })
      .finally(() => {
        dispatch(setLoading(false));
      });
    if (user) {
      dispatch(setUser(user));
      // homeに遷移
      history.push("/home");
    }
  };
  return (
    <Container maxWidth="xs">
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <h1>Singup</h1>
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            error={!!errors.name}
            helperText={errors.name && errors.name[0].message}
            name="name"
            label="name"
            value={form.name}
            onChange={handleChange("name")}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            error={!!errors.email}
            helperText={errors.email && errors.email[0].message}
            name="email"
            label="email"
            value={form.email}
            onChange={handleChange("email")}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            error={!!errors.password}
            helperText={errors.password && errors.password[0].message}
            name="password"
            type="password"
            label="password"
            value={form.password}
            onChange={handleChange("password")}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            error={!!errors.password_confirmation}
            helperText={
              errors.password_confirmation &&
              errors.password_confirmation[0].message
            }
            name="password_confirmation"
            type="password"
            label="password confirmation"
            value={form.password_confirmation}
            onChange={handleChange("password_confirmation")}
          />
        </Grid>
        <Grid item xs={4}>
          <Button title="SEND" loading={loading} onClick={handleClick} />
        </Grid>
      </Grid>
    </Container>
  );
}
