import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// progress制御用
type State = {
  loading: boolean;
};

const initialState: State = {
  loading: false,
};

const loadingModule = createSlice({
  name: "loading",
  initialState,
  // action
  reducers: {
    setLoading(state: State, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
  },
});

export const { setLoading } = loadingModule.actions;

export default loadingModule;
