import GroupChannel from './GroupChannel/GroupChannel';
import s from './LeftSide.module.css';

export default function Channels() {
  return (
    <div className={s["channels-container"]}>
      <GroupChannel
        title="canales de texto"
        channels={[{ name: "general", id: "hola" }, { name: "general", id: "xd" }]}
      />
      <GroupChannel
        title="canales de texto"
        channels={[{ name: "general", id: "hola" }, { name: "general", id: "xd" }]}
      />
    </div>
  );
}