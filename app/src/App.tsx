import { useEffect, useRef, useState } from 'react';
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
  const [loadingUser, setLoadingUser] = useState(false);

  useEffect(() => {
    setLoadingUser(true);
    getUserToken().then(async token => {
      if (!token) return navigate('/auth')

      addLoader(COLORS.FOLLY);
      const { ok, error, data } = await userFetchs.loginToken(token) as any as DefaultResponse;

      if (ok) dispatch(userActions.login(data))
      else {
        navigate('/auth')
        failureNotification(error!);
      }

      removeLoader();
    }).finally(() => setLoadingUser(false))

  }, []);

  useEffect(() => {
    if (user) navigate('/home');
    else if (!user && !loadingUser) navigate('/auth');
  }, [user, loadingUser]);

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
      {/* <ExampleComponent /> */}
    </>
  )
}

// const cache = new CellMeasurerCache({
//   defaultHeight: 100, // Altura por defecto de los elementos (puede ser cualquier valor)
//   fixedWidth: true, // Si el ancho de los elementos es fijo
// });

// Datos de ejemplo con alturas variables
// const data = [
//   { id: 1, text: 'Elemento 1Elemento 1Elemento 1Elemento 1Elemento 1Elemento 1Elemento 1Elemento 1Elemento 1Elemento 1Elemento 1Elemento 1Elemento 1Elemento 1Elemento 1Elemento 1Elemento 1Elemento 1Elemento 1Elemento 1Elemento 1Elemento 1Elemento 1Elemento 1Elemento 1Elemento 1Elemento 1Elemento 1Elemento 1Elemento 1Elemento 1Elemento 1Elemento 1Elemento 1Elemento 1Elemento 1Elemento 1Elemento 1', height: 50 },
//   { id: 2, text: 'Elemento 2', height: 80 },
//   { id: 3, text: 'Elemento 3', height: 120 },
//   { id: 4, text: 'Elemento 1', height: 50 },
//   { id: 5, text: 'Elemento 2', height: 80 },
//   { id: 6, text: 'Elemento 3', height: 120 },
//   { id: 7, text: 'Elemento 1', height: 50 },
//   { id: 8, text: 'Elemento 2', height: 80 },
//   { id: 9, text: 'Elemento 3', height: 120 },
//   { id: 10, text: 'Elemento 1', height: 50 },
//   { id: 12, text: 'Elemento 2', height: 80 },
//   { id: 13, text: 'Elemento 1Elemento 1Elemento 1Elemento 1Elemento 1Elemento 1Elemento 1Elemento 1Elemento 1Elemento Elemento 1Elemento 1Elemento 1Elemento 1Elemento 1Elemento 1Elemento 1Elemento 1Elemento 1Elemento 1Elemento 1Elemento 1Elemento 1Elemento 1Elemento 1Elemento 1Elemento 1Elemento 1Elemento 1Elemento 1Elemento 1Elemento 1Elemento 1Elemento 1Elemento 1Elemento 1Elemento 1Elemento 1Elemento 1Elemento 1Elemento 1Elemento 1Elemento 1Elemento 1Elemento 1Elemento 1Elemento 1Elemento 1', height: 720 },
//   // ...
// ];

// function ExampleComponent() {
//   const listRef = useRef(null);
//   const cacheRef = useRef(
//     new CellMeasurerCache({
//       fixedHeight: false,
//       fixedWidth: false,
//     })
//   );

//   useEffect(() => {
//     cacheRef.current.clearAll();
//     listRef.current.recomputeRowHeights();
//     listRef.current.measureAllRows();
//   }, [data]);

//   const rowRenderer = ({ index, key, parent, style }) => {
//     const item = data[index];

//     return (
//       <CellMeasurer
//         key={key}
//         cache={cacheRef.current}
//         parent={parent}
//         columnIndex={0}
//         rowIndex={index}
//       >
//         {({ measure }) => (
//           <div style={style} onLoad={measure}>
//             <div>{item.text}</div>
//             {/* Contenido del elemento */}
//           </div>
//         )}
//       </CellMeasurer>
//     );
//   };

//   return (
//     <div style={{ width: '50%', height: '50%' }}>
//       <AutoSizer>
//         {
//           ({ width, height }) => {
//             cacheRef.current.clearAll();
//             return <List
//               ref={listRef}
//               width={width}
//               height={height}
//               rowCount={data.length}
//               rowHeight={cacheRef.current.rowHeight}
//               rowRenderer={rowRenderer}
//             />
//           }}
//       </AutoSizer>
//     </div>
//   );
// };


export default App
