import { failureNotification } from "@/helpers/notify";
import { channelFetchs } from "@/redux/actions/channel";
import { getChannelState } from "@/redux/slices/channel";
import { getUserState } from "@/redux/slices/user";
import { useCallback } from "react";
import { useSelector } from "react-redux";
import Messages from "..";
import setCloudinaryImages from "@/helpers/setCloudinaryImages";
import { RequestAddChannelMessage } from "@/redux/actions/channel/http-messages/type";
import { DirectionRequest, TimeRequest } from "@/redux/actions/channel/type";

export default function ChannelMessages({ chatId }: { chatId: string; }) {
  const { channelsDetail, currentChannelId } = useSelector(getChannelState);
  const { accessToken } = useSelector(getUserState).user!;

  const getMessages = useCallback(async (time: TimeRequest, to: DirectionRequest, lastId: string) => {
    if (!channelsDetail || !chatId) return;

    try {
      const { results } = await channelFetchs.getMessages({
        channelId: channelsDetail[currentChannelId!]._id,
        query: {
          lastId,
          chatId,
          to,
          time
        },
        accessToken: accessToken
      })

      return { continue: results.continue, newItems: results.messages }
    } catch (e: any) {
      console.log("error channel messages get", e)
      failureNotification(e.response.data.message);
    }
  }, [channelsDetail, currentChannelId, chatId]);

  const setMessage = async (value: string, files: File[]) => {
    if (!value.length && !files.length) return;

    let newMessage: RequestAddChannelMessage = {
      accessToken,
      channelId: channelsDetail[currentChannelId!]!._id,
      chatId,
      message: { value: value ? value : '' },
    };

    try {
      let updatedMessage = {
        ...newMessage,
        message: {
          ...newMessage.message,
          photos: files.length ? await setCloudinaryImages({ images: files, accessToken }) : []
        }
      };

      await channelFetchs.addMessage(updatedMessage);
    } catch (e: any) {
      console.log("Error trying to set message", e)
    }
  }

  const deleteMessages = async (ids: string[]) => {
    if(!currentChannelId || !chatId) return;

    await channelFetchs.deleteMessages({ chatId, channelId: currentChannelId, ids, accessToken })
  };

  return (
    <Messages
      getMessages={getMessages}
      setMessage={setMessage}
      deleteMessages={deleteMessages}
      scrollItemsKey={chatId}
    />
  )
}