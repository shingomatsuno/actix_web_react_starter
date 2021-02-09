import { combineReducers } from "@reduxjs/toolkit";
import loadingModule from "./modules/loadingModule";
import userModule from "./modules/userModule";

const rootReducer = combineReducers({
  user: userModule.reducer,
  loading: loadingModule.reducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
