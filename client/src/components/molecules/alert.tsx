import { createStyles, makeStyles } from "@material-ui/core/styles";
import { useSelector } from "react-redux";
import { RootState } from "../../store/rootReducer";
import { useDispatch } from "react-redux";
import { closeAlert } from "../../store/modules/alertModule";
import IconButton from "@material-ui/core/IconButton";
import Collapse from "@material-ui/core/Collapse";
import CloseIcon from "@material-ui/icons/Close";
import Alrt from "../atoms/alert";

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      maxWidth: "500px",
      margin: "0 auto",
    },
  })
);

// alertメッセージを表示
export default function Alert() {
  const dispatch = useDispatch();
  const classes = useStyles();
  const alert = useSelector((state: RootState) => state.alert);
  const handleClose = () => {
    dispatch(closeAlert());
  };

  if (!alert.open) {
    return <div></div>;
  }
  return (
    <div className={classes.root}>
      <Collapse in={alert.open}>
        <Alrt
          severity={alert.severity}
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={handleClose}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
        >
          {alert.message}
        </Alrt>
      </Collapse>
    </div>
  );
}
