import { combineReducers } from "@reduxjs/toolkit";
import loadingModule from "./modules/loadingModule";
import userModule from "./modules/userModule";
import alertModule from "./modules/alertModule";

const rootReducer = combineReducers({
  user: userModule.reducer,
  loading: loadingModule.reducer,
  alert: alertModule.reducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
