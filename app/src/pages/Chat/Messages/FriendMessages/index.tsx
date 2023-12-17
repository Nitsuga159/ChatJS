import { failureNotification } from "@/helpers/notify";
import { getUserState } from "@/redux/slices/user";
import { AppDispatch } from "@/redux/store";
import { DefaultResponse } from "@/types/const.type";
import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import Messages from "..";
import { getFriendChatState } from "@/redux/slices/friend";
import { friendActions, friendFetchs } from "@/redux/actions/friend";
import { v4 as uuidV4 } from "uuid";
import { RequestAddFriendMessage } from "@/redux/actions/friend/type";
import setCloudinaryImages from "@/helpers/setCloudinaryImages";

export default function FriendMessages({ chatId }: { chatId: string; }) {
  const dispatch: AppDispatch = useDispatch();
  const { chats } = useSelector(getFriendChatState);
  const accessToken = useSelector(getUserState).user?.accessToken!;

  const chat = chats[chatId!] || { continue: true, lastId: null, messages: [] };

  const getMessages = useCallback(async () => {
    const { lastId } = chat
    const { ok, data, error } =
      (await friendFetchs.getMessages({ friendId: chatId, lastId, accessToken, })) as any as DefaultResponse;

    if (ok) dispatch(friendActions.getMessages({ ...data, friendId: chatId }));
    else failureNotification(error!);
  }, [chat, chatId]);

  const setMessage = async (value: string, files: File[]) => {
    if (!value.length && !files.length) return;

    let newMessage: RequestAddFriendMessage = {
      accessToken,
      friendId: chatId,
      clientId: uuidV4(),
      value: value ? value : ''
    };

    //dispatch(friendActions.setMessagesToSend(newMessage));

    try {
      let updatedMessage = {
        ...newMessage,
        photos: files.length ? await setCloudinaryImages({ images: files, accessToken }) : []
      };

      const { ok } = await friendFetchs.addMessage(updatedMessage) as any as DefaultResponse;

      if (!ok) throw new Error();

    } catch (e: any) {
      //dispatch(channelActions.errorMessageToSend(newMessage.clientId))
    }
  }

  const deleteMessages = async (ids: string[]) => {
    try {
      await friendFetchs.deleteMessages({ accessToken, friendId: chatId, ids });

    } catch (e: any) {
      console.log("error al eliminar mensajes: ", e)
    }
  };

  return (
    <Messages
      chat={chat}
      getMessages={getMessages}
      setMessage={setMessage}
      deleteMessages={deleteMessages}
      resendMessage={() => { }}
    />
  )
}