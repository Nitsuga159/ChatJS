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

axios.defaults.baseURL = ENVS.BACKEND_URL || "http://localhost:3070";


function App() {
  const { user } = useSelector(getUserState);
  const navigate: NavigateFunction = useNavigate();
  const dispatch: AppDispatch = useDispatch();
  const [loadingUser, setLoadingUser] = useState(false);

  useEffect(() => {
    setLoadingUser(true);
    getUserToken().then(async token => {
      if (!token) return navigate('/auth')

      addLoader(COLORS.FOLLY);

      try {
        const { results } = await userFetchs.info(token);

        dispatch(userActions.login({ ...results, accessToken: token }))
      } catch (e: any) {
        navigate('/auth')
        failureNotification(e.response.data.message);
      }

      removeLoader();
    }).finally(() => setLoadingUser(false))
  }, []);

  useEffect(() => {
    if (user) {
      navigate('/home');
    } else if (!user && !loadingUser) {
      navigate('/auth');
    }
  }, [user, loadingUser]);

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



/** @todo USE THIS FUNCTION FOR SHARE SCREEN IN A COOMING FEATURE... */
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