import axios from "axios";
import { RequestAddFriend } from "./type";
import { Friend, InitialStateFriends } from "@/redux/slices/friend/type";
import { PayloadAction } from "@reduxjs/toolkit";
import defaultError from "@/helpers/defaultError";
import { DefaultResponse } from "@/types/const.type";

const addFriend = async ({
  accessToken,
  tokenNotification,
}: RequestAddFriend): Promise<boolean> => {
  await axios.post(
    `/friend?tokenNotification=${tokenNotification}`,
    {},
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );

  return true;
};

export const addFriendReducer = (
  state: InitialStateFriends,
  action: PayloadAction<Friend>
) => {
  state.friend.friends = [...state.friend.friends, action.payload];
};
export default addFriend;
