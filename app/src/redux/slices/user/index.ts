import { RootState } from "../../store";
import { InitialStateUser } from "@/types/user.type";
import { createSlice } from "@reduxjs/toolkit";
import { loginReducer } from "@/redux/actions/user/login";
import { setUserToken } from "@/ipc-electron";

const initialState: InitialStateUser = {
  user: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    reset(state) {
      state.user = null;
    },
    login: loginReducer,
    loginToken: loginReducer,
  },
});

export const getUserState = (state: RootState) => state.user;

export const { actions, reducer } = userSlice;
