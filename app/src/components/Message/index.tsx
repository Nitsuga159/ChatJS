import * as S from './Message.styled';
import { HeaderMessageProps, MessageProps, NormalMessageProps, SimpleMessageProps } from './type';
import { useContext, useState, useCallback, useMemo, useEffect } from 'react';
import { copyImageToClipboard } from 'copy-image-clipboard';
import { ContextMenuContext } from '../Providers/ContextMenu';
import { MdOutlineContentCopy } from 'react-icons/md'
import { FiSave } from 'react-icons/fi'
import downloadFile from '@/helpers/downloadFile';
import { MenuItemType } from '../Providers/ContextMenu/type';
import { ShowOnAllScreenContext } from '../Providers/ShowOnAllScreen';
import CSSAnimation from '../CSSAnimation';
import Options from '../Options';
import { useDispatch, useSelector } from 'react-redux';
import { getChatMode, getMessagesToDelete } from '@/redux/slices/general';
import { AppDispatch } from '@/redux/store';
import { generalActions } from '@/redux/actions/general';
import { DefaultButton } from '@/index.styled';
import { COLORS } from '@/styles';
import { getUserState } from '@/redux/slices/user';
import { getChannelState } from '@/redux/slices/channel';
import { ChatMode } from '@/redux/slices/general/type';
import { haveMessageStatus } from '@/types/chat.type';
import React from 'react';

const makeItemsMenu = (image: HTMLImageElement): MenuItemType[] =>
  [
    {
      icon: <MdOutlineContentCopy />,
      name: "Copy image",
      onSelect: async () => await copyImageToClipboard(image.src)
    },
    {
      icon: <FiSave />,
      name: "Save image",
      onSelect: () => downloadFile(image.src, "hola.jpg")
    }
  ]

const Message = (
  { id, isToDelete, haveMessagesToDelete, senderId, value, username, color, createdAt, userPhoto, messagePhotos, refresh, status }:
    MessageProps
) => {
  const dispatch: AppDispatch = useDispatch();
  const { _id } = useSelector(getUserState).user!;
  const chatMode = useSelector(getChatMode);
  const { channelDetail } = useSelector(getChannelState);
  const { showOnAllScreen } = useContext(ShowOnAllScreenContext);
  const handleOpenContextMenu = useContext(ContextMenuContext);
  const isHeader = typeof username === 'string';
  const canDelete = _id === senderId || (chatMode === ChatMode.CHANNEL_CHAT && channelDetail?.admin === _id)
  const [isIn, setIsIn] = useState<boolean>(false);

  const currentDate =
    <S.Date isHeader={isHeader} isIn={isIn}>
      {createdAt.toLocaleTimeString().slice(0, -3)}
    </S.Date>;

  const LeftSideContent =
    !username ?
      currentDate :
      userPhoto ?
        <S.UserPhoto src={userPhoto} /> :
        <S.DefaultPhoto color={color!} />;

  const handleClickMessageImage = useCallback((photoURL: string) => showOnAllScreen(
    (isOpen: boolean) =>
      <CSSAnimation open={isOpen} timeout={300}>
        {
          (status) => <S.MessageImageComplete status={status} src={photoURL} />
        }
      </CSSAnimation>
  ), []);

  const checkAddMessageToDelete = useCallback(() => {
    if (!canDelete) return;

    if (isToDelete) return dispatch(generalActions.removeMessageToDelete(id));

    dispatch(generalActions.addMessageToDelete(id));
  }, [isToDelete, canDelete, id]);

  const rowProps = haveMessageStatus(status) ? { status } : {
    onClick: haveMessagesToDelete ? checkAddMessageToDelete : undefined,
    onMouseEnter: () => setIsIn(true),
    onMouseLeave: () => setIsIn(false),
    isHeader,
    isToDelete,
    deleteMode: haveMessagesToDelete
  }

  return (
    <S.Row {...rowProps}>
      {
        !haveMessageStatus(status) && canDelete && isIn && !haveMessagesToDelete &&
        <Options
          coords={{ top: -30, right: 6 }}
          itemsOption={
            [{ show: <DefaultButton><S.RemoveMessagesIcon style={{ color: COLORS.FOLLY }} /></DefaultButton>, onSelect: checkAddMessageToDelete }]
          }
        />
      }
      <S.LeftSideContainer>{LeftSideContent}</S.LeftSideContainer>
      <S.MessageContainer>
        {username && <S.From color={color!}>{username} {currentDate}</S.From>}
        {
          messagePhotos.map((photoURL, index) =>
            <S.MessageImage
              key={index}
              src={photoURL}
              onLoad={() => refresh()}
              onClick={!haveMessageStatus(status) ? haveMessagesToDelete ? undefined : () => handleClickMessageImage(photoURL) : undefined}
              onContextMenu={!haveMessageStatus(status) ? (e) => handleOpenContextMenu(e, makeItemsMenu(e.target as HTMLImageElement)) : undefined}
            />
          )
        }
        {value.split('\n').map((paragraph, index) => <S.Text key={index}>{paragraph}</S.Text>)}
      </S.MessageContainer>
    </S.Row>
  );
};

export const HeaderMessage = React.memo((props: HeaderMessageProps) => {
  return (
    <Message
      {...props}
    />
  );
})

export const SimpleMessage = React.memo((props: SimpleMessageProps) => {
  return (
    <Message
      {...props}
    />
  );
})

