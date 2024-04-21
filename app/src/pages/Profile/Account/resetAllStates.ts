import { generalActions } from "@/redux/actions/general";
import { notificationActions } from "@/redux/actions/notifications";
import { userActions } from "@/redux/actions/user";
import { actions as channelActions } from "@/redux/slices/channel";
import { actions as friendActions } from "@/redux/slices/friend";
import { AppDispatch } from "@/redux/store";

export default (dispatch: AppDispatch) => {
  dispatch(channelActions.reset());
  dispatch(friendActions.reset());
  dispatch(notificationActions.reset());
  dispatch(userActions.logout());
  dispatch(generalActions.reset());
};
