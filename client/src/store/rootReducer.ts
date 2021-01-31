import { combineReducers } from "@reduxjs/toolkit";
import userModule from "./modules/userModule";

const rootReducer = combineReducers({
  user: userModule.reducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
