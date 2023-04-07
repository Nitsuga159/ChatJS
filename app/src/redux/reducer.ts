import {
  LOGIN_FAILURE,
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGOUT,
} from "@/actions/user";
import { InitialState } from "@/types/initialState.type";

const initailState: InitialState = {
  user: { state: "waiting", loading: false, data: null },
};

export default function rootReducer(
  state: InitialState = initailState,
  action: any
): InitialState {
  switch (action.type) {
    case LOGIN_REQUEST:
      return {
        ...state,
        user: { ...state.user, loading: true },
      };
    case LOGIN_SUCCESS:
      return {
        ...state,
        user: { state: "logged", loading: false, data: action.payload },
      };
    case LOGIN_FAILURE:
      return {
        ...state,
        user: { ...state.user, loading: false },
      };
    case LOGOUT:
      return {
        ...state,
        user: { state: "not logged", loading: false, data: null },
      };
    default:
      return state;
  }
}
