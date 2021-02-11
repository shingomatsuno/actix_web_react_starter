import { useSelector } from "react-redux";
import { RootState } from "../../store/rootReducer";
import { useDispatch } from "react-redux";
import { closeSnack } from "../../store/modules/snackbarModule";
import Snack from "@material-ui/core/Snackbar";
import Alert from "../atoms/alert";

// snackbarを表示
export default function Snackbar() {
  const dispatch = useDispatch();
  const snackbar = useSelector((state: RootState) => state.snackbar);
  const handleClose = () => {
    dispatch(closeSnack());
  };

  return (
    <Snack
      open={snackbar.open}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
      autoHideDuration={6000}
      onClose={handleClose}
    >
      <Alert onClose={handleClose} severity={snackbar.severity}>
        {snackbar.message}
      </Alert>
    </Snack>
  );
}
