import { useCallback, useState } from "react";
import { IoIosArrowForward, IoIosArrowDown } from 'react-icons/io/index'
import s from './GroupChannel.module.css';
import { AppDispatch } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { actions as channelActions, getChannelState } from "@/redux/slices/channel";
import { getGeneralState } from "@/redux/slices/general";
import { ChatMode } from "@/redux/slices/general/type";
import { generalActions } from "@/redux/actions/general";

export default function ChannelItems(
  { title, channels }:
    { title: string, channels: { name: string, _id: string, messagesCount: number }[] }
) {
  const dispatch: AppDispatch = useDispatch();
  const { currentChatId } = useSelector(getChannelState);
  const { chatMode } = useSelector(getGeneralState);

  const [openGroupChannel, setOpenGroupChannel] = useState<boolean>(true);

  const handleClickChannelChat = useCallback(
    (_id: string) => {
      if (currentChatId !== _id)
        dispatch(channelActions.setCurrentChannelChatId(_id));

      if (chatMode !== ChatMode.CHANNEL_CHAT)
        dispatch(generalActions.setChatMode(ChatMode.CHANNEL_CHAT));
    }, [currentChatId]);

  return (
    <div style={{ margin: ".2rem 0", padding: ".8rem .8rem 0 .8rem" }}>
      <p
        className={s.title}
        onClick={() => setOpenGroupChannel(prev => !prev)}
      >{openGroupChannel ? <IoIosArrowDown /> : <IoIosArrowForward />}&emsp;{title.toUpperCase()}</p>
      <div>
        {
          openGroupChannel && channels.map(({ name, _id }) => (
            <p
              key={_id}
              className={s.channel}
              onClick={() => handleClickChannelChat(_id)}
            >
              <span>·</span> {name}
            </p>
          ))
        }
      </div>
    </div>
  );
}