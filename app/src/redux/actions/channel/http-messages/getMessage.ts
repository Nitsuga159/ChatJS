import utils from "@/utils";
import { RequestGetChannelMessages, ResponseGetChannelMessages } from "./type";
import { getFetch } from "@/utils/fetch";

const getMessages = async ({
  channelId,
  query,
  accessToken,
}: RequestGetChannelMessages): Promise<{ status: number, results: ResponseGetChannelMessages}> => {
  return await getFetch({ 
    endpoint: `/channel-chat/message/${channelId}`, 
    query: { ...query },
    headers: utils.createHeaderToken(accessToken)
  })
};

export default getMessages;
