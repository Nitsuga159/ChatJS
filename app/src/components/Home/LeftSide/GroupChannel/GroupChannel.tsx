import { useState } from "react";
import { IoIosArrowForward, IoIosArrowDown } from 'react-icons/io/index'
import s from './GroupChannel.module.css';

export default function GroupChannel(
  { title, channels }:
    { title: string, channels: { name: string, id: string }[] }
) {

  const [openGroupChannel, setOpenGroupChannel] = useState<boolean>(true);

  return (
    <div style={{ margin: ".2rem 0" }}>
      <p
        className={s.title}
        onClick={() => setOpenGroupChannel(prev => !prev)}
      >{openGroupChannel ? <IoIosArrowDown /> : <IoIosArrowForward />} {title.toUpperCase()}</p>
      <div>
        {
          openGroupChannel && channels.map(({ name, id }) => (
            <p
              key={id}
              className={s.channel}
              onClick={() => console.log(id)}
            >
              <span>·</span> {name}
            </p>
          ))
        }
      </div>
    </div>
  );
}