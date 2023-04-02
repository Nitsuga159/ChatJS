import { ChangeEvent, useCallback, useRef, useState } from 'react';
import s from './Chat.module.css';
import Message from './Message/Message';

export default function Chat() {

  const [text, setText] = useState<string>("");
  const [messages, setMessages] = useState([
    { text: "holaaa", name: "Agus", color: "#8C9EFF" },
    { text: "holaaa", name: "hola", color: "#34A7E0" },
    { text: "Holaaaaa como va todo jajajaja re loco esto xdxd Holaaaaa como va todo jajajaja re loco esto xdxd Holaaaaa como va todo jajajaja re loco esto xdxd Holaaaaa como va todo jajajaja re loco esto xdxd Holaaaaa como va todo jajajaja re loco esto xdxd Holaaaaa como va todo jajajaja re loco esto xdxd", name: "Mateo", color: "#2BED52" },
    { text: "holaaa", name: "Agus", color: "#8C9EFF" },
    { text: "holaaa", name: "hola", color: "#34A7E0" },
    { text: "Holaaaaa como va todo jajajaja re loco esto xdxd Holaaaaa como va todo jajajaja re loco esto xdxd Holaaaaa como va todo jajajaja re loco esto xdxd Holaaaaa como va todo jajajaja re loco esto xdxd Holaaaaa como va todo jajajaja re loco esto xdxd Holaaaaa como va todo jajajaja re loco esto xdxd", name: "Mateo", color: "#2BED52" },
    { text: "holaaa", name: "Agus", color: "#8C9EFF" },
    { text: "holaaa", name: "hola", color: "#34A7E0" },
    { text: "Holaaaaa como va todo jajajaja re loco esto xdxd Holaaaaa como va todo jajajaja re loco esto xdxd Holaaaaa como va todo jajajaja re loco esto xdxd Holaaaaa como va todo jajajaja re loco esto xdxd Holaaaaa como va todo jajajaja re loco esto xdxd Holaaaaa como va todo jajajaja re loco esto xdxd", name: "Mateo", color: "#2BED52" }
  ]);

  const handleChangeTextInput = useCallback((e: ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value)
    if (e.target.scrollHeight < 300) {
      e.target.style.height = "50px";
      e.target.style.height = e.target.scrollHeight + "px";
    }
  }, []);

  return (
    <div className={s["chat-container"]} >
      <div className={s.chat}>
        {
          messages.map(({ text, name, color }, index) => (
            <Message key={index} text={text} name={name} color={color} />
          ))
        }
      </div>
      <div className={s["input-container"]}>
        <textarea
          style={{
            height: "50px"
          }}
          onKeyDown={(e) => (e.key === "Enter" && !e.shiftKey) && console.log(text)}
          onChange={handleChangeTextInput}
          className={s.input}
          placeholder={"Send message"}
          value={text}
        ></textarea>
      </div>
    </div>
  );
}