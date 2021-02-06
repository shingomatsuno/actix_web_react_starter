import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "../../types/userType";

// ログインユーザを保持する
type State = {
  user: User | null;
};

const initialState: State = {
  user: null,
};

const userModule = createSlice({
  name: "user",
  initialState,
  // action
  reducers: {
    setUser(state: State, action: PayloadAction<User | null>) {
      state.user = action.payload ? { ...action.payload } : null;
    },
  },
});

export const { setUser } = userModule.actions;

export default userModule;
