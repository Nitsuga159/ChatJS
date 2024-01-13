import { actions } from "@/redux/slices/user";
import login from "./login";
import info from "./info";
import createCodeVerification from "./createCodeVerification";
import verifyCode from "./verifyCode";
import createUser from "./createUser";

export const userActions = actions;

const userFetchs = {
  login,
  info,
  createCodeVerification,
  verifyCode,
  createUser,
};

export { userFetchs };
