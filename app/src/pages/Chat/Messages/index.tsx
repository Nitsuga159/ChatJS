import * as S from './Messages.styled';
import TextArea from '@/components/TextArea';
import MessageSkeleton from '@/components/Skeletons/MessageSkeleton';
import { AppDispatch } from '@/redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { useCallback, useEffect, useRef } from 'react';
import { v4 as uuidV4 } from 'uuid';
import { DefaultButton } from '@/index.styled';
import { getMessagesToDelete } from '@/redux/slices/general';
import { generalActions } from '@/redux/actions/general';
import VirtualizedItem from '@/components/VirtualizedItem';
import { HeaderMessage, SimpleMessage } from '@/components/Message';
import CurrentDate from '@/components/CurrentDate';
import { Message } from '@/types/chat.type';
import { IMessagesProps } from './type';

export default function Messages(
  { chat, getMessages, setMessage, deleteMessages, resendMessage }:
    IMessagesProps
) {
  const { continue: canContinue, messages } = chat;
  const dispatch: AppDispatch = useDispatch();
  const messagesToDelete = useSelector(getMessagesToDelete);
  const infiniteScrollId = useRef<string>(uuidV4()).current;

  useEffect(() => {
    return () => {
      dispatch(generalActions.resetMessagesToDelete())
    }
  }, []);

  const mapMessages = useCallback((index: number) => {
    const prevItem = messages[index - 1] as Message;
    const item = messages[index] as Message;
    const {
      createdAt,
      message: { value, sender, photos }
    } = item;

    const createdAtDate = new Date(createdAt);

    const isSameUser = prevItem && prevItem.message.sender._id === sender._id;
    const addDate = !prevItem || new Date(prevItem.createdAt).toLocaleDateString() !== createdAtDate.toLocaleDateString();
    const isToDelete = messagesToDelete.includes(item._id!)
    const haveMessagesToSend = messagesToDelete.length !== 0
    return (
      <VirtualizedItem rootId={infiniteScrollId} key={item._id}>
        {(refresh) =>
        (
          <>{addDate && <CurrentDate date={createdAtDate} />}

            {
              !isSameUser ?
                <HeaderMessage
                  id={item._id!}
                  senderId={sender._id}
                  username={sender.username}
                  value={value}
                  createdAt={createdAtDate}
                  color={sender.color}
                  userPhoto={sender.photo}
                  messagePhotos={photos}
                  refresh={refresh}
                  isToDelete={isToDelete}
                  haveMessagesToDelete={haveMessagesToSend}
                />
                :
                <SimpleMessage
                  id={item._id!}
                  senderId={sender._id}
                  messagePhotos={photos}
                  value={value}
                  createdAt={createdAtDate}
                  refresh={refresh}
                  isToDelete={isToDelete}
                  haveMessagesToDelete={haveMessagesToSend}
                />
            }
          </>)}
      </VirtualizedItem>

    )
  }, [messages, messagesToDelete]);

  return (
    <S.ChatContainer>
      {messagesToDelete.length !== 0 &&
        <S.NavBarDeleteMessages>
          <S.SelectedMessages>{messagesToDelete.length} selected messages</S.SelectedMessages>
          <S.Buttons>
            <DefaultButton
              onClick={() => {
                deleteMessages(messagesToDelete);
                dispatch(generalActions.resetMessagesToDelete());
              }}
            >
              <S.RemoveMessagesIcon />
            </DefaultButton>
            <DefaultButton
              onClick={() => dispatch(generalActions.resetMessagesToDelete())}
            >
              <S.CancelMessagesIcon />
            </DefaultButton>
          </S.Buttons>
        </S.NavBarDeleteMessages>
      }
      <S.ChatMessages
        id={infiniteScrollId}
        itemsLength={messages.length}
        renderItem={mapMessages}
        fetchItems={getMessages}
        hasMore={canContinue}
        margin={300}
        loading={<MessageSkeleton cuantity={7} />}
        up
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