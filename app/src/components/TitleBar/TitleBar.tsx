import minimize from '../../assets/minimize.svg';
import fullscreen from '../../assets/fullscreen.svg';
import restore from '../../assets/restore.svg';
import close from '../../assets/close.svg';
import { ipcRenderer } from 'electron';
import { useState, useEffect } from 'react';
import LogoIcon from '../Svg/LogoIcon/LogoIcon';
import { setCloseWindow, setFullscreenWindow, setMinimizeWindow, setRestoreWindow } from '@/ipc-electron';
import styled from 'styled-components';
import { COLORS, PRE_VALUES } from '@/styles';

const Container = styled.header`
  ${PRE_VALUES.FLEX}
  justify-content: space-between;
  height: var(--titlebar-height);  
  background-color: ${COLORS.GRAY};
  user-select: none;
`;

const Title = styled.div`
  width: 100%;
  height: 100%;
  text-align: left;
  -webkit-app-region: drag;
  /* Allow user to drag the window using this titlebar */
  -webkit-user-select: none;
  /* Prevent user from selecting things */
  user-select: none;
`;

const TitleName = styled.h6`
  margin: 0;
  font-family: sans-serif;
  font-weight: 600;
  font-size: .9rem;
  display: flex;
  align-items: center;
  height: 100%;
  color: var(--gray);
`;

const States = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
  cursor: pointer;
`;

const StateItem = styled.div`
  height: 100%;
  padding: 0 0.5rem;
  display: flex;
  align-items: center;
  transition: background-color .15s ease;
  &:hover {
    background-color: rgb(37, 37, 37);
  }
  &:last-child:hover {
    background-color: rgb(236, 52, 52);
  }
`;

const StateIcon = styled.img`
  height: 40%;
`;

export default function TitleBar() {
  const [isFullScreen, setIsFullScreen] = useState(false);

  useEffect(() => {
    ipcRenderer.on("maximize", () => setIsFullScreen(true));
    ipcRenderer.on("restore", () => setIsFullScreen(false));
  }, [])


  return (
    <Container>
      <Title>
        <TitleName><LogoIcon className='icon' color="#dcdcdc" />chat.js</TitleName>
      </Title>
      <States>
        <StateItem
          className="item-right"
          title="minimize"
          onClick={setMinimizeWindow}
        >
          <StateIcon src={minimize} alt="close-button" draggable={false} />
        </StateItem>
        <StateItem
          onClick={() => {
            setIsFullScreen(prev => !prev);
            isFullScreen ? setRestoreWindow() : setFullscreenWindow()
          }}
          className="item-right"
          title={isFullScreen ? "restore" : "fullscreen"}
        >
          <StateIcon src={isFullScreen ? restore : fullscreen} alt="close-button" draggable={false} />
        </StateItem>
        <StateItem
          onClick={setCloseWindow}
          className="item-right"
          title="close"
        >
          <StateIcon src={close} alt="close-button" draggable={false} />
        </StateItem>
      </States>
    </Container>
  )
}