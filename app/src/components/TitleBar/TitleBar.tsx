import minimize from '../../assets/minimize.svg';
import fullscreen from '../../assets/fullscreen.svg';
import restore from '../../assets/restore.svg';
import close from '../../assets/close.svg';
import { ipcRenderer } from 'electron';
import { useCallback, useState, useEffect } from 'react';
import LogoIcon from '../Svg/LogoIcon/LogoIcon';

export default function TitleBar() {
  const [isFullScreen, setIsFullScreen] = useState(false);

  const handleSendEvent = useCallback(
    (event: "minimize" | "fullscreen" | "restore" | "close") =>
      ipcRenderer.send(event), []
  );

  useEffect(() => {
    ipcRenderer.on("maximize", () => setIsFullScreen(true));
    ipcRenderer.on("restore", () => setIsFullScreen(false));
  }, [])


  return (
    <header className="titlebar">
      <div className='title'>
        <h6 className='title-name'><LogoIcon className='icon' color="#dcdcdc" />chat.js</h6>
      </div>
      <div className="titlebar-right">
        <div
          className="item-right"
          title="minimize"
          onClick={() => handleSendEvent("minimize")}
        >
          <img src={minimize} alt="close-button" draggable={false} />
        </div>
        <div
          onClick={() => {
            setIsFullScreen(prev => !prev);
            handleSendEvent(isFullScreen ? "restore" : "fullscreen")
          }}
          className="item-right"
          title={isFullScreen ? "restore" : "fullscreen"}
        >
          <img src={isFullScreen ? restore : fullscreen} alt="close-button" draggable={false} />
        </div>
        <div
          onClick={() => handleSendEvent("close")}
          className="item-right"
          title="close"
        >
          <img src={close} alt="close-button" draggable={false} />
        </div>
      </div>
    </header>
  )
}