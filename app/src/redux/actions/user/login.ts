import { initSocket } from "@/SocketIO";
import ENVS from "@/envs";
import { InitialStateUser, User } from "@/types/user.type";
import { PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

const login = async (user: {
  mail: string;
  password: string;
}): Promise<User> => {
  await new Promise<void>((resolve) =>
    setTimeout(() => {
      resolve();
    }, 2000)
  );

  const { data } = await axios.post("/user/login", user);

  return data;
};

export const loginReducer = (
  state: InitialStateUser,
  action: PayloadAction<User>
) => {
  state.user = action.payload;
};

export default login;
