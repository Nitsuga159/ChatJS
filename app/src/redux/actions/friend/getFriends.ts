import { InitialStateFriends } from "@/redux/slices/friend/type";
import { PayloadAction } from "@reduxjs/toolkit";
import { RequestGetFriends, ResponseGetFriends } from "./type";
import axios from "axios";
import { DefaultResponse } from "@/types/const.type";

const getFriends = async ({
  accessToken,
  lastId,
}: RequestGetFriends): Promise<ResponseGetFriends> => {
  const { data }: { data: ResponseGetFriends } = await axios.get(
    `/friend?lastId=${lastId || ""}`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );

  return data;
};

export const getFriendsReducer = (
  state: InitialStateFriends,
  action: PayloadAction<ResponseGetFriends>
) => {
  const { continue: canContinue, results } = action.payload;

  state.friend.continue = canContinue;
  state.friend.lastId = results[0]._id;
  state.friend.friends = [...state.friend.friends, ...results];
};

export default getFriends;
