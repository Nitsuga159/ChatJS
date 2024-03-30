import { Friend, InitialStateFriends } from "@/redux/slices/friend/type";
import { PayloadAction } from "@reduxjs/toolkit";
import { RequestGetFriends, ResponseGetFriends } from "./type";
import utils from "@/utils";
import { getFetch } from "@/utils/fetch";

const getFriends = async ({
  accessToken,
  query
}: RequestGetFriends): Promise<{ status: number, results: ResponseGetFriends}> => {
  return await getFetch({ 
    endpoint: '/friend', 
    query: {
      ...query
    },
    headers: utils.createHeaderToken(accessToken)
  })
};

export const getFriendsReducer = (
  state: InitialStateFriends,
  action: PayloadAction<Friend[]>
) => {
  state.friends = action.payload;
};

export default getFriends;
