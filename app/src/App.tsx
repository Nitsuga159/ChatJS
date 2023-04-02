import { useEffect } from 'react';
import Home from './components/Home/Home';
import TitleBar from './components/TitleBar/TitleBar';
import { ipcRenderer } from 'electron';

function App() {

  useEffect(() => {
    ipcRenderer.on("token:get", (_, data) => {
      if (typeof data === 'string') {
        alert("there are a token")
      }
    })

    ipcRenderer.send("token:get");
  }, []);

  return (
    <>
      <TitleBar />
      <Home />
    </>
  )
}

export default App
