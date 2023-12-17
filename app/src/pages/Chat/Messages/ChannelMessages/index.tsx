import { failureNotification } from "@/helpers/notify";
import { channelActions, channelFetchs } from "@/redux/actions/channel";
import { getChatChannelsState, getChannelState } from "@/redux/slices/channel";
import { getUserState } from "@/redux/slices/user";
import { AppDispatch } from "@/redux/store";
import { DefaultResponse } from "@/types/const.type";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Messages from "..";
import setCloudinaryImages from "@/helpers/setCloudinaryImages";
import { v4 as uuidV4 } from "uuid";
import { RequestAddChannelMessage } from "@/redux/actions/channel/http-messages/type";
import { IMessagesToSend } from "@/redux/slices/channel/type";
import { MessageStatus } from "@/types/chat.type";

export default function ChannelMessages({ chatId }: { chatId: string; }) {
  const dispatch: AppDispatch = useDispatch();
  const { chats } = useSelector(getChatChannelsState);
  const { channelDetail } = useSelector(getChannelState);
  const { accessToken, _id, photo, color, username } = useSelector(getUserState).user!;
  const chat = chats[chatId] || { continue: true, lastId: null, messages: [] };

  const getMessages = useCallback(async () => {
    if (!channelDetail || !chatId) return;

    const { _id } = channelDetail
    const { lastId } = chat
    const { ok, data, error } =
      (await channelFetchs.getMessages({ channelId: _id, chatId: chatId, lastId, accessToken, })) as any as DefaultResponse;

    if (ok) dispatch(channelActions.getMessages(data));
    else failureNotification(error!);
  }, [chat, channelDetail, chatId]);

  const setMessage = async (value: string, files: File[]) => {
    if (!value.length && !files.length) return;

    let newMessage: RequestAddChannelMessage = {
      accessToken,
      channelId: channelDetail!._id,
      chatId,
      clientId: uuidV4(),
      message: { value: value ? value : '' },
    };

    dispatch(channelActions.addMessage({
      message: {
        ...newMessage,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: MessageStatus.WAITING,
        message: {
          value: value ? value : '',
          photos: files.map(url => URL.createObjectURL(url)),
          sender: {
            _id,
            photo: photo || undefined,
            color,
            username
          }
        }
      }, isToSend: true
    }));

    try {
      let updatedMessage = {
        ...newMessage,
        message: {
          ...newMessage.message,
          photos: files.length ? await setCloudinaryImages({ images: files, accessToken }) : []
        }
      };

      const { ok } = await channelFetchs.addMessage(updatedMessage) as any as DefaultResponse;

      if (!ok) throw new Error();

    } catch (e: any) {
      dispatch(channelActions.errorMessageToSend(newMessage.clientId))
    }
  }

  const resendMessage = async (messageToResend: IMessagesToSend) => {
    const { status, ...message } = messageToResend;
    dispatch(channelActions.resendMessage(message.clientId));

    try {
      await channelFetchs.addMessage(message);

    } catch (e: any) {
      dispatch(channelActions.errorMessageToSend(message.clientId))
    }
  }

  const deleteMessages = async (ids: string[]) => {
    try {
      await channelFetchs.deleteMessages({ accessToken, channelId: channelDetail!._id, chatId, ids });

    } catch (e: any) {
      console.log("error al eliminar mensajes: ", e)
    }
  };

  useEffect(() => {
    return () => {
      dispatch(channelActions.checkLimitMessages(chatId));
    }
  }, []);

  return (
    <Messages
      chat={chat}
      getMessages={getMessages}
      setMessage={setMessage}
      deleteMessages={deleteMessages}
      resendMessage={resendMessage}
    />
  )
}