import { PayloadAction } from "@reduxjs/toolkit";
import utils from "@/utils";
import axios from "axios";
import { InitialStateChannels } from "@/redux/slices/channel/type";
import { RequestDeleteChatChannel, ResponseDeleteChatChannel } from "../type";

const deleteChat = async ({
  channelId,
  chatId,
  accessToken,
}: RequestDeleteChatChannel): Promise<void> => {
  await axios.delete(
    `/channel/delete-chat/${channelId}?chatId=${chatId}`,
    utils.createHeaderToken(accessToken)
  );
};

export const deleteChatReducer = (
  state: InitialStateChannels,
  action: PayloadAction<ResponseDeleteChatChannel>
) => {
  const { channelId, chatId } = action.payload;
  const { channelDetail } = state.channel;
  if (channelDetail?._id === channelId)
    channelDetail.chats = channelDetail.chats.filter(
      ({ _id }) => _id !== chatId
    );
};

export default deleteChat;
