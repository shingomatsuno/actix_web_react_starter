import { combineReducers } from "@reduxjs/toolkit";
import loadingModule from "./modules/loadingModule";
import userModule from "./modules/userModule";
import alertModule from "./modules/alertModule";
import snackbarModule from "./modules/snackbarModule";

const rootReducer = combineReducers({
  user: userModule.reducer,
  loading: loadingModule.reducer,
  alert: alertModule.reducer,
  snackbar: snackbarModule.reducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
