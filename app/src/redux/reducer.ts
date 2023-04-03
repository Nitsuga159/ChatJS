import { LOGIN_USER, NOT_LOGIN_USER } from "@/actions/user";
import { InitialState } from "@/types/initialState.type";

const initailState: InitialState = {
  user: { state: "waiting", data: null },
};

export default function rootReducer(
  state: InitialState = initailState,
  action: any
): InitialState {
  switch (action.type) {
    case LOGIN_USER:
      return { ...state, user: { state: "logged", data: action.payload } };
    case NOT_LOGIN_USER:
      return { ...state, user: { state: "not logged", data: null } };
    default:
      return state;
  }
}
