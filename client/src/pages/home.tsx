import { useEffect, useState } from "react";
import Grid from "@material-ui/core/Grid";
import Container from "@material-ui/core/Container";
import TextField from "@material-ui/core/TextField";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store/rootReducer";
import { UpdateParam, User } from "../types/userType";
import { makeStyles } from "@material-ui/core/styles";
import Button from "../components/atoms/button";
import * as api from "../api/users";
import { setLoading } from "../store/modules/loadingModule";
import { setUser } from "../store/modules/userModule";
import { openSnack } from "../store/modules/snackbarModule";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles(() => ({
  title: {
    display: "Flex",
    width: "510px",
    justifyContent: "space-between",
  },
  frex: {
    display: "Flex",
  },
  container: {
    marginLeft: 0,
  },
}));

export default function Home() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();
  // ログインユーザ取得
  const { user } = useSelector((state: RootState) => state.user);
  const { loading } = useSelector((state: RootState) => state.loading);
  const [form, setForm] = useState<UpdateParam>({ name: "", email: "" });
  const [editMode, setEditMode] = useState(false);
  const [errors, setErrors] = useState<any>({});

  useEffect(() => {
    document.title = "ホーム";
    const { name, email } = user || form;
    setForm({ name, email });
  }, []);

  const handleChange = (key: string) => (e: any) => {
    setForm({ ...form, [key]: e.target.value });
  };

  const handleClick = () => {
    // 編集モード、閲覧モード切り替え
    setEditMode(!editMode);
    setErrors({});
    const { name, email } = user || form;
    setForm({ name, email });
  };

  const handeUpdate = async () => {
    dispatch(setLoading(true));
    const res = await api
      .update({ ...form })
      .catch((e) => {
        setErrors({ ...e.response.data });
      })
      .finally(() => {
        dispatch(setLoading(false));
      });
    if (res) {
      dispatch(setUser(res));
      setEditMode(false);
      dispatch(openSnack({ message: "更新完了しました" }));
    }
  };

  return (
    <div>
      <div className={classes.title}>
        <h2>HOME</h2>
        <div className={classes.frex}>
          {editMode && (
            <div>
              <Button title="更新" loading={loading} onClick={handeUpdate} />
            </div>
          )}
          <div>
            <Button
              title={editMode ? "閲覧" : "編集"}
              loading={loading}
              variant="outlined"
              onClick={handleClick}
            />
          </div>
        </div>
      </div>
      <Container maxWidth="xs" className={classes.container}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              error={!!errors.name}
              helperText={errors.name && errors.name[0].message}
              name="name"
              label="name"
              value={form.name}
              InputProps={{
                readOnly: !editMode,
                disableUnderline: !editMode,
              }}
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
              InputProps={{
                readOnly: !editMode,
                disableUnderline: !editMode,
              }}
              onChange={handleChange("email")}
            />
          </Grid>
        </Grid>
      </Container>
    </div>
  );
}
