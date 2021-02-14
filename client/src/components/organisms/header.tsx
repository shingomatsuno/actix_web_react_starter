import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Button from "@material-ui/core/Button";
import { Link, useHistory } from "react-router-dom";
import * as auth from "../../api/auth";
import { useSelector } from "react-redux";
import { RootState } from "../../store/rootReducer";
import { useDispatch } from "react-redux";
import { setUser } from "../../store/modules/userModule";
import { setLoading } from "../../store/modules/loadingModule";
import LinearProgress from "@material-ui/core/LinearProgress";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    display: "flex",
    justifyContent: "space-between",
  },

  menuButton: {
    marginRight: theme.spacing(2),
  },
  link: {
    flexGrow: 1,
    color: "white",
    textDecoration: "none",
  },
  leftButton: {
    flexGrow: 1,
    color: "white",
    textDecoration: "none",
    marginRight: 30,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerContainer: {
    overflow: "auto",
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
}));

export default function Header() {
  const classes = useStyles();

  const dispatch = useDispatch();
  const history = useHistory();
  const { user } = useSelector((state: RootState) => state.user);
  const { loading } = useSelector((state: RootState) => state.loading);

  const logout = async () => {
    dispatch(setLoading(true));
    await auth.logout().finally(() => {
      dispatch(setLoading(false));
    });
    dispatch(setUser(null));
    history.push("/login");
  };

  return (
    <AppBar position="fixed" className={classes.appBar}>
      <Toolbar className={classes.root}>
        <div>
          <Link className={classes.link} to="/">
            TOP
          </Link>
        </div>
        {user ? (
          <div>
            <Link className={classes.leftButton} to="/home">
              MYPAGE
            </Link>
            <Button color="inherit" onClick={logout}>
              LOGOUT
            </Button>
          </div>
        ) : (
          <div>
            <Link className={classes.leftButton} to="/signup">
              SIGNUP
            </Link>
            <Link className={classes.link} to="/login">
              LOGIN
            </Link>
          </div>
        )}
      </Toolbar>
      {loading && <LinearProgress color="secondary" />}
    </AppBar>
  );
}
