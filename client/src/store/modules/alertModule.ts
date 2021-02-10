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

const alertModule = createSlice({
  name: "alert",
  initialState,
  // action
  reducers: {
    openAlert(
      state: State,
      action: PayloadAction<{
        message?: string;
        severity?: Color;
      }>
    ) {
      let { message, severity } = action.payload;
      message = message || "";
      severity = severity || "info";
      // メッセージがあるときだけ表示
      const open = !!message;
      state.open = !!message;
      state.message = message;
      state.severity = severity;
    },
    closeAlert(state: State) {
      state.open = false;
    },
  },
});

export const { openAlert, closeAlert } = alertModule.actions;

export default alertModule;
