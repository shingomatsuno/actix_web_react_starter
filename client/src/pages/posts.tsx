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
import { Link, useHistory } from "react-router-dom";
import { PostParam, Post } from "../types/postType";
import Pagination from "@material-ui/lab/Pagination";

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

export default function Posts() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();
  // ログインユーザ取得
  const { loading } = useSelector((state: RootState) => state.loading);
  const [errors, setErrors] = useState<any>({});
  const [posts, setPosts] = useState<Array<Post>>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);

  const fetchPosts = async (page: number) => {
    dispatch(setLoading(true));
    // post一覧を取得
    const data = await api.get(page);
    setPosts(data.data);
    setTotal(data.total);
    dispatch(setLoading(false));
  };

  const handleClick = () => {
    // 登録画面に遷移
    history.push("/post");
  };

  const handleChange = (_: any, value: number) => {
    // ページ変更
    setPage(value);
    fetchPosts(value);
  };

  useEffect(() => {
    document.title = "ポスト";
    fetchPosts(1);
  }, []);

  return (
    <div>
      <div className={classes.title}>
        <h2>POST</h2>
        <div>
          <Button
            title="登録"
            loading={loading}
            variant="outlined"
            onClick={handleClick}
          />
        </div>
      </div>
      <div>
        <table>
          <tbody>
            {posts.map((item, i) => {
              return (
                <tr key={i}>
                  <td>{item.title}</td>
                  <td>{item.body}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {total >= 1 && (
          <Pagination
            count={total}
            showFirstButton
            showLastButton
            page={page}
            disabled={loading}
            onChange={handleChange}
          />
        )}
      </div>
    </div>
  );
}
