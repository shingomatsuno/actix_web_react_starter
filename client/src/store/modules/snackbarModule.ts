import { Color } from "@material-ui/lab/Alert";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// progress制御用
type State = {
  open: boolean;
  message: string;
  severity: Color;
};

const initialState: State = {
  open: false,
  message: "",
  severity: "info",
};

const snackbarModule = createSlice({
  name: "alert",
  initialState,
  // action
  reducers: {
    openSnack(
      state: State,
      action: PayloadAction<{
        message?: string;
        severity?: Color;
      }>
    ) {
      let { message, severity } = action.payload;
      // メッセージがあるときだけ表示
      state.open = !!message;
      state.message = message || "";
      state.severity = severity || "info";
    },
    closeSnack(state: State) {
      state.open = false;
    },
  },
});

export const { openSnack, closeSnack } = snackbarModule.actions;

export default snackbarModule;
