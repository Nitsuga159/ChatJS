import * as S from './Message.styled';
import { HeaderMessageProps, MessageProps, BasicMessageProps, SimpleMessageProps, MessageType } from './type';
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
import { getChatMode } from '@/redux/slices/general';
import { DefaultButton } from '@/index.styled';
import { COLORS } from '@/styles';
import { getUserState } from '@/redux/slices/user';
import { getChannelState } from '@/redux/slices/channel';
import { ChatMode } from '@/redux/slices/general/type';
import React from 'react';

const makeItemsMenu = (image: HTMLImageElement): MenuItemType[] =>
  [
    {
      icon: <MdOutlineContentCopy />,
      name: "Copy image",
      hasDivider: true,
      onSelect: async () => await copyImageToClipboard(image.src)
    },
    {
      icon: <FiSave />,
      name: "Save image",
      color: COLORS.FOLLY,
      onSelect: () => downloadFile(image.src, new Date().toISOString() + ".jpeg")
    }
  ]

const Message = React.memo((
  { id, type, isToDelete, addToDelete, removeToDelete, senderId, value, username, color, createdAt, userPhoto, messagePhotos }:
    MessageProps
) => {
  const { _id } = useSelector(getUserState).user!;
  const chatMode = useSelector(getChatMode);
  const { channelsDetail: channelDetail, currentChatId } = useSelector(getChannelState);
  const showOnAllScreen = useContext(ShowOnAllScreenContext);
  const handleOpenContextMenu = useContext(ContextMenuContext);
  const isHeader = type === MessageType.HEADER;
  const canDelete = _id === senderId || (chatMode === ChatMode.CHANNEL_CHAT && channelDetail[currentChatId!]?.admin === _id)
  const [isInside, setIsInside] = useState<boolean>(false);

  const currentDate =
    <S.Date isHeader={isHeader} isIn={isInside}>
      {createdAt.toLocaleTimeString().slice(0, -3)}
    </S.Date>;

  const LeftSideContent =
    !username ?
      currentDate :
      userPhoto ?
        <S.UserPhoto src={userPhoto} /> :
        <S.DefaultPhoto color={color!} />;

  const handleClickMessageImage = (photoURL: string) => showOnAllScreen(
    (isOpen: boolean) =>
      <CSSAnimation open={isOpen} timeout={300}>
        {
          (status) => <S.MessageImageComplete width={200} height={200} status={status} src={photoURL} />
        }
      </CSSAnimation>
  );

  const addMessageToDelete = useCallback(() => {
    if (!canDelete || isToDelete) return;

    addToDelete(id)
    setIsInside(false)
  }, [isToDelete, canDelete, id]);

  return (
    <S.Row 
      id={id} 
      onClick={isToDelete ? () => removeToDelete(id) : undefined} 
      isToDelete={isToDelete} 
      isHeader={isHeader} 
      onMouseEnter={() => setIsInside(true)} 
      onMouseLeave={() => setIsInside(false)}
    >
      {
        !isToDelete && canDelete && isInside &&
        <Options
          coords={{ top: -20, right: 6 }}
          itemsOption={
            [{ show: <DefaultButton><S.RemoveMessagesIcon style={{ color: COLORS.FOLLY }} /></DefaultButton>, onSelect: addMessageToDelete }]
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
              width={250}
              height={50}
              src={photoURL}
              onClick={isToDelete ? undefined : () => handleClickMessageImage(photoURL)}
              onContextMenu={isToDelete ? undefined : (e) => handleOpenContextMenu(e, makeItemsMenu(e.target as HTMLImageElement))}
            />
          )
        }
        {value.split('\n').map((paragraph, index) => <S.Text key={index}>{paragraph}</S.Text>)}
      </S.MessageContainer>
    </S.Row>
  );
});

export default Message