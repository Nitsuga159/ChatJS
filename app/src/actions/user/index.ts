import { AnyAction } from "redux";
import { AppDispatch, RootState } from "../../redux/store";
import { ThunkAction } from "redux-thunk";
import axios from "axios";

export const LOGIN_REQUEST = "LOGIN_REQUEST";
export const LOGIN_FAILURE = "LOGIN_FAILURE";
export const LOGIN_SUCCESS = "LOGIN_SUCCESS";
export const LOGOUT = "LOGOUT";

/* REDUX ACTIONS  */

export const login = (user: {
  username: string;
  password: string;
}): ThunkAction<void, RootState, unknown, AnyAction> => {
  return async (dispatch: AppDispatch) => {
    dispatch({ type: LOGIN_REQUEST });

    await new Promise<void>((resolve) =>
      setTimeout(() => {
        resolve();
      }, 3000)
    );

    try {
      const { data } = await axios.post("/auth/login", user);
      dispatch({ type: LOGIN_SUCCESS, payload: data });
    } catch (e) {
      dispatch({ type: LOGIN_FAILURE });
    }
  };
};

export const loginWithToken = (
  token: string
): ThunkAction<void, RootState, unknown, AnyAction> => {
  return async (dispatch: AppDispatch) => {
    try {
      return dispatch({ type: LOGIN_SUCCESS });
    } catch (e) {}
  };
};

export const logout = () => {
  return { type: LOGOUT };
};

/* SIMPLE ACTIONS */

export const getTokenUser = async (): Promise<string | null> => {
  return null;
};

export const setToken = async (): Promise<boolean> => {
  return true;
};

export const createCodeVerification = async (
  mail: string
): Promise<boolean> => {
  try {
    const {
      data: { success },
    }: { data: { success: boolean } } = await axios.post(
      `/code-verification/${mail}`
    );

    return success;
  } catch (e) {
    return false;
  }
};
