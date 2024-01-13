import { InitialStateFriends } from "@/redux/slices/friend/type";
import { PayloadAction } from "@reduxjs/toolkit";
import { RequestGetFriends, ResponseGetFriends } from "./type";
import axios from "axios";

const getFriends = async ({
  accessToken,
  lastId,
}: RequestGetFriends): Promise<{ status: number, results: ResponseGetFriends}> => {
  const { data } = await axios.get(
    `/friend${lastId ? `?lastId=${lastId}` : ''}`,
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
  const { continue: canContinue, friends } = action.payload;

  state.friend.continue = canContinue;
  state.friend.lastId = friends[0]?._id;
  state.friend.friends = [...state.friend.friends, ...friends];
};

export default getFriends;
