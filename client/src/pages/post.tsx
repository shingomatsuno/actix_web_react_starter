import { useEffect, useState } from "react";
import Grid from "@material-ui/core/Grid";
import Container from "@material-ui/core/Container";
import TextField from "@material-ui/core/TextField";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store/rootReducer";
import { UpdateParam, User } from "../types/userType";
import { makeStyles } from "@material-ui/core/styles";
import Button from "../components/atoms/button";
import * as api from "../api/posts";
import { setLoading } from "../store/modules/loadingModule";
import { setUser } from "../store/modules/userModule";
import { openSnack } from "../store/modules/snackbarModule";
import { useHistory } from "react-router-dom";
import { PostParam } from "../types/postType";

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

export default function Post() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();
  // ログインユーザ取得
  const { loading } = useSelector((state: RootState) => state.loading);
  const [form, setForm] = useState<PostParam>({ title: "", body: "" });
  const [editMode, setEditMode] = useState(false);
  const [errors, setErrors] = useState<any>({});

  useEffect(() => {
    document.title = "ポスト";
  }, []);

  const handleChange = (key: string) => (e: any) => {
    setForm({ ...form, [key]: e.target.value });
  };

  const handleClick = () => {
    // 編集モード、閲覧モード切り替え
    setEditMode(!editMode);
    setErrors({});
  };

  const handeUpdate = async () => {
    dispatch(setLoading(true));
    const res = await api
      .regist({ ...form })
      .catch((e) => {
        setErrors({ ...e.response.data });
      })
      .finally(() => {
        dispatch(setLoading(false));
      });
    if (res) {
      setEditMode(false);
      dispatch(openSnack({ message: "登録完了しました" }));
    }
  };

  return (
    <div>
      <div className={classes.title}>
        <h2>POST</h2>
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
              error={!!errors.title}
              helperText={errors.title && errors.title[0].message}
              name="title"
              label="title"
              value={form.title}
              InputProps={{
                readOnly: !editMode,
                disableUnderline: !editMode,
              }}
              onChange={handleChange("title")}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              error={!!errors.body}
              helperText={errors.body && errors.body[0].message}
              name="body"
              label="body"
              value={form.body}
              InputProps={{
                readOnly: !editMode,
                disableUnderline: !editMode,
              }}
              onChange={handleChange("body")}
            />
          </Grid>
        </Grid>
      </Container>
    </div>
  );
}
