import { channelActions } from "@/redux/actions/channel";
import { friendActions } from "@/redux/actions/friend";
import { generalActions } from "@/redux/actions/general";
import { notificationActions } from "@/redux/actions/notifications";
import { userActions } from "@/redux/actions/user";
import { AppDispatch } from "@/redux/store";

export default (dispatch: AppDispatch) => {
  dispatch(friendActions.reset());
  dispatch(channelActions.reset());
  dispatch(notificationActions.reset());
  dispatch(userActions.reset());
  dispatch(generalActions.reset());
};
