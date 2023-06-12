import { useEffect, useState } from 'react';
import TitleBar from './components/TitleBar/TitleBar';
import { ipcRenderer } from 'electron';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from './redux/store';
import { Route, Routes, useNavigate, NavigateFunction } from 'react-router-dom';
import axios from 'axios';
import { getUserToken } from './ipc-electron';
import Home from './pages/Home';
import Auth from './pages/Auth/Auth';
import AllProviders from './components/Providers';
import ENVS from './envs';
import { getUserState } from './redux/slices/user';
import { addLoader, removeLoader } from './helpers/loaderFullScreen/loaderFullScreen';
import { COLORS } from './styles';
import { userActions, userFetchs } from './redux/actions/user';
import { failureNotification } from './helpers/notify';
import { DefaultResponse } from './types/const.type';

axios.defaults.baseURL = ENVS.BACKEND_URL || "http://localhost:3070";

function App() {
  const { user } = useSelector(getUserState);
  const navigate: NavigateFunction = useNavigate();
  const dispatch: AppDispatch = useDispatch();

  useEffect(() => {

    getUserToken().then(async token => {
      if (!token) return navigate('/auth')

      addLoader(COLORS.FOLLY);
      const { ok, error, data } = await userFetchs.loginToken(token) as any as DefaultResponse;

      ok ? dispatch(userActions.login(data)) : failureNotification(error!);

      removeLoader();
    })

  }, []);

  useEffect(() => {
    if (user) return navigate('/home');
  }, [user]);

  async function initVideo() {
    const response = await ipcRenderer.invoke("user-devices");

    const stream = await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: {
        mandatory: {
          chromeMediaSource: 'desktop',
          chromeMediaSourceId: response[1].id,
          minWidth: 1280,
          maxWidth: 1280,
          minHeight: 720,
          maxHeight: 720
        }
      }
    } as any)
  }

  return (
    <>
      <TitleBar />
      <main id="main">
        <AllProviders>
          <Routes>
            <Route path="/" element={<></>} />
            <Route path="/home" element={<Home />} />
            <Route path="/auth" element={<Auth />} />
          </Routes>
        </AllProviders>
      </main>
    </>
  )
}

export default App
