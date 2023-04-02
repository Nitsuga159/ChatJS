import LeftSide from './LeftSide/LeftSide';
import Chat from './Chat/Chat';
import s from './Home.module.css';
import RightSide from './RightSide/RightSide';

export default function Home() {
  return (
    <div className={s["home-container"]}>
      <LeftSide />
      <Chat />
      <RightSide />
    </div>
  );
}