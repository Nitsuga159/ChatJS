import { useEffect, useState } from 'react';
import Home from './components/Home/Home';
import TitleBar from './components/TitleBar/TitleBar';
import { ipcRenderer as comunicator } from 'electron';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from './redux/store';
import { loginWithToken, logout } from './actions/user';
import { Route, Routes, useNavigate, NavigateFunction } from 'react-router-dom';
import { InitialState } from './types/initialState.type';
import { User } from './types/user.type';
import Auth from './components/Auth/Auth';
import axios from 'axios';

axios.defaults.baseURL = process.env.REACT_APP_BACKEND || "http://localhost:3070";

function App() {
  const user: User = useSelector((state: InitialState) => state.user);
  const navigate: NavigateFunction = useNavigate();
  const dispatch: AppDispatch = useDispatch();

  useEffect(() => {
    comunicator.on("token:get", (_, data) => {
      dispatch(
        typeof data === 'string' ?
          loginWithToken(data) :
          logout()
      );
    });

    comunicator.send("token:get");
  }, []);

  useEffect(() => {
    if (user.state === 'waiting') navigate('/')
    if (user.state === 'logged') navigate('/home')
    if (user.state === 'not logged') navigate('/login')
  }, [user.state]);

  return (
    <>
      <TitleBar />
      <Routes>
        <Route path="/" element={<h1>A ESPERAR!</h1>} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Auth />} />
      </Routes>
    </>
  )
}

export default App
