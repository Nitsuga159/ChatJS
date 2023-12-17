import { SetStateAction, useEffect, useState } from 'react';
import { Mode } from '@/types/auth.type';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '@/redux/store';
import validations from '../../../validations/user.validation'
import s from './LoginForm.module.css';
import Field from '@/components/Field';
import { COLORS } from '@/styles';
import { getUserState } from '@/redux/slices/user';
import { addLoader, removeLoader } from '@/helpers/loaderFullScreen/loaderFullScreen';
import { userActions, userFetchs } from '@/redux/actions/user';
import { failureNotification } from '@/helpers/notify';
import { DefaultResponse } from '@/types/const.type';
import { setUserToken } from '@/ipc-electron';
import { User } from '@/types/user.type';

type LoginFormProps = {
  setMode: (mode: SetStateAction<Mode>) => void,
}

export default function LoginForm({ setMode }: LoginFormProps) {
  const dispatch: AppDispatch = useDispatch();
  const [inputs, setInputs] = useState({
    mail: "",
    password: ""
  });
  const [inputErrors, setInputErrors] = useState({
    mail: validations.mail(""),
    password: validations.password("")
  });
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const handleFormChange = (value: string, name: string) => {
    setInputs(inputs => ({ ...inputs, [name]: value }));
    setInputErrors(errors => ({
      ...errors,
      [name]: validations[name as "password" | "mail"](value)
    }))
  }

  const handleLogin = async () => {
    const isError: boolean =
      Object.values(inputErrors)
        .some((error: string) => error !== "");

    if (isError) return;

    addLoader(COLORS.FOLLY);

    const { ok, error, data } = await userFetchs.login(inputs) as any as DefaultResponse;

    if (ok) {
      dispatch(userActions.login(data));
      setUserToken((data as User).accessToken)
    } else failureNotification(error!);

    removeLoader();
  }

  return (
    <div className={s.loginContainer}>
      <h4 className={s.title}>WELCOME</h4>
      <Field
        name='mail'
        type='text'
        value={inputs.mail}
        error={inputErrors.mail}
        onChange={handleFormChange}
      />
      <Field
        name='password'
        type={showPassword ? 'text' : 'password'}
        value={inputs.password}
        error={inputErrors.password}
        onChange={handleFormChange}
      />
      <div className={s.showPasswordContainer}>
        <input
          id="show-password"
          type="checkbox"
          checked={showPassword}
          onChange={() => setShowPassword(!showPassword)}
        />
        <label htmlFor='show-password' className={s.showPasswordLabel}>show password ?</label>
      </div>
      <p className={s.text}>
        You don't have an account ? <a onClick={() => setMode(Mode.REGISTER)} className={s.signUp}>Sign up here</a>
      </p>
      <button onClick={handleLogin} className={s.submitButton}>Login</button>
    </div>
  );
}