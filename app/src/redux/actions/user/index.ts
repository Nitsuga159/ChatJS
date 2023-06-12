import { actions } from "@/redux/slices/user";
import login from "./login";
import loginToken from "./loginToken";
import createCodeVerification from "./createCodeVerification";
import verifyCode from "./verifyCode";
import createUser from "./createUser";
import addTryCatch from "@/helpers/addTryCatch";

export const userActions = actions;

const userFetchs = {
  login,
  loginToken,
  createCodeVerification,
  verifyCode,
  createUser,
};

type UserFetchsKeys = keyof typeof userFetchs;

for (let key in userFetchs)
  userFetchs[key as UserFetchsKeys] = addTryCatch(
    userFetchs[key as UserFetchsKeys]
  ) as any;

export { userFetchs };
