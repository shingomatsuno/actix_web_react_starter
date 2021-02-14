import { makeStyles } from "@material-ui/core/styles";
import Toolbar from "@material-ui/core/Toolbar";
import MUDrawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import { useLocation, useHistory } from "react-router-dom";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
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

const menus = [
  { text: "HOME", to: "/home" },
  { text: "TODO", to: "/todo" },
];

export default function Drawer() {
  const classes = useStyles();
  const location = useLocation();
  const history = useHistory();
  const handleClick = (key: number) => (e: any) => {
    const to = menus[key].to;
    history.push(to);
  };

  return (
    <MUDrawer
      className={classes.drawer}
      variant="permanent"
      classes={{
        paper: classes.drawerPaper,
      }}
    >
      <Toolbar />
      <div className={classes.drawerContainer}>
        <List>
          {menus.map((menu, i) => (
            <ListItem
              button
              key={i}
              selected={location.pathname === menu.to}
              onClick={handleClick(i)}
            >
              <ListItemText primary={menu.text} />
            </ListItem>
          ))}
        </List>
      </div>
    </MUDrawer>
  );
}
