import { PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import utils from "@/utils";
import { InitialStateFriends } from "@/redux/slices/friend/type";
import {
  RequestDeleteFriendMessage,
  ResponseDeleteFriendMessage,
} from "./type";
import { DefaultResponse } from "@/types/const.type";

const deleteMessages = async ({
  friendId,
  ids,
  accessToken,
}: RequestDeleteFriendMessage): Promise<string> => {
  await axios.delete(
    `/friend-chat/message/${friendId}?ids=${ids.join(",")}`,
    utils.createHeaderToken(accessToken)
  );

  return "Messages deleted";
};

export const deleteMessagesReducer = (
  state: InitialStateFriends,
  action: PayloadAction<ResponseDeleteFriendMessage>
) => {
  const { ids, friendId } = action.payload;
  const { messages } = state.chat.chats[friendId];

  const idsSet = new Set(ids);

  state.chat.chats[friendId].messages = messages.filter(
    ({ _id }) => !idsSet.has(_id!)
  );
};

export default deleteMessages;
