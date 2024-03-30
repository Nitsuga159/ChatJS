import * as S from './Messages.styled';
import TextArea from '@/components/TextArea';
import MessageSkeleton from '@/components/Skeletons/MessageSkeleton';
import { Fragment, useCallback, useState } from 'react';
import { DefaultButton } from '@/index.styled';
import Message from '@/components/Message';
import CurrentDate from '@/components/CurrentDate';
import { Message as MessageInterface } from '@/types/chat.type';
import { IMessagesProps } from './type';
import { DirectionRequest } from '@/redux/actions/channel/type';
import { MessageType } from '@/components/Message/type';

export default function Messages(
  { scrollItemsKey, giveRef, deleteMessages, getMessages, setMessage }:
    IMessagesProps
) {
  const [messagesToDelete, setMessageToDelete] = useState<string[]>([])

  const addToDelete = useCallback((id: string) => {
    setMessageToDelete(prev => prev.length === 10 ? prev : [...prev, id])
  }, [])

  const removeToDelete = useCallback((id: string) => {
    setMessageToDelete(prev => prev.filter(cid => cid !== id))
  }, [])

  const mapMessages = useCallback((message: MessageInterface, index: number, messages: MessageInterface[]) => {
    const prevItem = messages[index - 1]
    const item = message;
    const { createdAt, message: { value, sender, photos } } = item;

    const createdAtDate = new Date(createdAt);
    const isSameUser = prevItem && prevItem?.message.sender._id === sender._id;
    const addDate = !prevItem || new Date(prevItem?.createdAt).toLocaleDateString() !== createdAtDate.toLocaleDateString();

    return (
      <Fragment key={item._id}>
        {addDate && <CurrentDate date={createdAtDate} />}
        <Message
          {...(isSameUser ?
            { type: MessageType.NORMAL } :
            {
              type: MessageType.HEADER,
              username: sender.username,
              color: sender.color,
              userPhoto: sender.photo
            })
          }
          addToDelete={addToDelete}
          removeToDelete={removeToDelete}
          id={item._id!}
          senderId={sender._id}
          messagePhotos={photos}
          value={value}
          createdAt={createdAtDate}
          isToDelete={messagesToDelete.includes(item._id!)}
        />
      </Fragment>
    )
  }, [messagesToDelete]);

  return (
    <S.ChatContainer>
      {messagesToDelete.length !== 0 &&
        <S.NavBarDeleteMessages>
          <S.SelectedMessages>{messagesToDelete.length} selected messages</S.SelectedMessages>
          <S.Buttons>
            <DefaultButton
              onClick={() => {
                deleteMessages(messagesToDelete)
                setMessageToDelete([])
              }}
            >
              <S.RemoveMessagesIcon />
            </DefaultButton>
            <DefaultButton onClick={() => setMessageToDelete([])}>
              <S.CancelMessagesIcon />
            </DefaultButton>
          </S.Buttons>
        </S.NavBarDeleteMessages>
      }
      <S.MessagesInifiniteScroll
        scrollItemsKey={scrollItemsKey}
        giveRef={giveRef}
        renderItem={mapMessages}
        fetchItems={getMessages}
        loading={<MessageSkeleton cuantity={8} />}
        startFrom={DirectionRequest.UP}
      />
      <TextArea
        onSendMessage={setMessage}
        maxAutoHeight={200}
        maxLength={2500}
        file={{ accept: "image/*", maxSizeFile: 5 }}
      />
    </S.ChatContainer>
  );
}