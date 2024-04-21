import { getUserState } from "@/redux/slices/user";
import { useContext } from "react";
import { useSelector } from "react-redux";
import Messages from "..";
import setCloudinaryImages from "@/helpers/setCloudinaryImages";
import { CreateFriendMessageAPI, DeleteFriendMessagesAPI, GetFriendMessagesAPI } from "@/components/Providers/http/friend-chat-api-interface";
import { HttpClientContext } from "@/components/Providers/http";

export default function FriendMessages({ chatId }: { chatId: string; }) {
  const httpClient = useContext(HttpClientContext)!
  const accessToken = useSelector(getUserState).user?.accessToken!;

  const setMessage = async (value: string, files: File[]) => {
    if (!value.length && !files.length) return;

    try {
      await httpClient(
        new CreateFriendMessageAPI({ 
          friendId: chatId, data: {
            message: { 
              value: value || '', 
              photos: files.length ? await setCloudinaryImages({ images: files, accessToken }) : [] 
            } 
          }
        })
      )
    } catch (e: any) {
      //dispatch(channelActions.errorMessageToSend(newMessage.clientId))
    }
  }

  const deleteMessages = async (ids: string[]) => {
    try {
      await httpClient(new DeleteFriendMessagesAPI({ friendId: chatId, ids }))

    } catch (e: any) {
      console.log("error al eliminar mensajes: ", e)
    }
  };

  return (
    <Messages
      api={new GetFriendMessagesAPI({ friendId: chatId })}
      setMessage={setMessage}
      deleteMessages={deleteMessages}
      scrollItemsKey={chatId}
    />
  )
}