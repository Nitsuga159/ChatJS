import { ChangeEvent, SetStateAction, useEffect, useState } from 'react';
import { BsEyeSlash, BsEye } from 'react-icons/bs';
import Loader from '@/components/Svg/Loader/Loader';
import { Mode } from '@/types/auth.type';
import { useDispatch, useSelector } from 'react-redux';
import { InitialState } from '@/types/initialState.type';
import { AppDispatch } from '@/redux/store';
import { login } from '@/actions/user';
import validations from '../../../Validations/user.validation'
import s from './LoginForm.module.css';

type LoginFormProps = {
  setMode: (mode: SetStateAction<Mode>) => void,
}

export default function LoginForm({ setMode }: LoginFormProps) {
  const { loading } = useSelector((state: InitialState) => state.user);
  const dispatch: AppDispatch = useDispatch();
  const [inputs, setInputs] = useState({
    username: "",
    password: ""
  });
  const [inputErrors, setInputErrors] = useState({
    username: validations.username(""),
    password: validations.password("")
  });
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const handleFormChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputs(inputs => ({ ...inputs, [e.target.name]: e.target.value }));
    setInputErrors(errors => ({
      ...errors,
      [e.target.name]: validations[e.target.name as "password" | "username"](e.target.value)
    }))
  }

  const handleLogin = () => {
    const error: boolean =
      Object.values(inputErrors)
        .some((error: string) => error !== "");

    if (error) return;

    dispatch(login(inputs));
  }

  return (
    <div className={s.loginContainer}>
      <h4 className={s.title}>WELCOME</h4>
      <div className={s.textContainer}>
        <label htmlFor='username' className={s.label}>username</label>
        {
          inputErrors["username"] &&
          <p className={s.error}>{inputErrors["username"]}</p>
        }
      </div>
      <input
        onChange={handleFormChange}
        type="text"
        id='username'
        value={inputs.username}
        name='username'
        className={s.input}
      />
      <div className={s.textContainer}>
        <label htmlFor='password' className={s.label}>
          password
          {
            showPassword ?
              <BsEye onClick={() => setShowPassword(false)} /> :
              <BsEyeSlash onClick={() => setShowPassword(true)} />
          }
        </label>
        {
          inputErrors["password"] &&
          <p className={s.error}>{inputErrors["password"]}</p>
        }
      </div>
      <input
        onChange={handleFormChange}
        type={showPassword ? "text" : "password"}
        id='password'
        value={inputs.password}
        name='password'
        className={s.input}
      />
      <p className={s.text}>
        You don't have an account ? <a onClick={() => setMode(Mode.REGISTER)} className={s.signUp}>Sign up here</a>
      </p>
      {
        loading ?
          <Loader className={s.loader} color="#FE4056ff" /> :
          <button onClick={handleLogin} className={s.submitButton}>Login</button>
      }


    </div>
  );
}