import { AnyAction } from "redux";
import { AppDispatch, RootState } from "../../redux/store";
import { ThunkAction } from "redux-thunk";

export const LOGIN_USER = "LOGIN_USER";
export const NOT_LOGIN_USER = "NOT_LOGIN_USER";

export const loginUser = (
  token: string
): ThunkAction<void, RootState, unknown, AnyAction> => {
  return async function (dispatch: AppDispatch) {
    try {
      return dispatch({ type: LOGIN_USER });
    } catch (e) {}
  };
};

export const notLoginUser = () => {
  return { type: NOT_LOGIN_USER };
};
