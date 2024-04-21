import { getChannelState } from "@/redux/slices/channel";
import { getUserState } from "@/redux/slices/user";
import { useSelector } from "react-redux";
import Messages from "..";
import setCloudinaryImages from "@/helpers/setCloudinaryImages";
import { CreateChannelMessagesAPI, DeleteChannelMessagesAPI, GetChannelMessagesAPI } from "@/components/Providers/http/channel-chat-api-interface";
import { useContext } from "react";
import { HttpClientContext } from "@/components/Providers/http";

export default function ChannelMessages({ chatId }: { chatId: string; }) {
  const { channelsDetail, currentChannelId } = useSelector(getChannelState);
  const { accessToken } = useSelector(getUserState).user!;
  const httpClient = useContext(HttpClientContext)!

  const setMessage = async (value: string, files: File[]) => {
    if (!value.length && !files.length) return;

    let channelChatData = {
      channelId: channelsDetail[currentChannelId!]!._id,
      chatId,
    }

    try {
      let message = {
        value: value || "",
        photos: files.length ? await setCloudinaryImages({ images: files, accessToken }) : []
      }

      await httpClient(new CreateChannelMessagesAPI({ data: { channelChatData, message } }))

    } catch (e: any) {
      console.log("Error trying to set message", e)
    }
  }

  const deleteMessages = async (ids: string[]) => {
    if (!currentChannelId || !chatId) return;

    await httpClient(new DeleteChannelMessagesAPI({ channelId: currentChannelId, params: { chatId, ids: ids.join(",") }  }))
  };

  return (
    <Messages
      api={new GetChannelMessagesAPI({ channelId: currentChannelId!, params: { chatId } })}
      setMessage={setMessage}
      deleteMessages={deleteMessages}
      scrollItemsKey={chatId}
    />
  )
}