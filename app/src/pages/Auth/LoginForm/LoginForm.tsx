import { SetStateAction, useState } from 'react';
import { Mode } from '@/types/auth.type';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '@/redux/store';
import validations from '../../../validations/user.validation'
import s from './LoginForm.module.css';
import Field from '@/components/Field';
import { COLORS } from '@/styles';
import { addLoader, removeLoader } from '@/helpers/loaderFullScreen/loaderFullScreen';
import { userActions, userFetchs } from '@/redux/actions/user';
import { failureNotification } from '@/helpers/notify';
import { setUserToken } from '@/ipc-electron';
import { getLanguage } from '@/redux/slices/general';
import t from '@/languages';
import { LOGIN_TEXTS } from '@/languages/texts/login.text';

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
  const language = useSelector(getLanguage)

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

    if (isError) {
      return;
    }

    addLoader(COLORS.FOLLY);

    try {
      const { result: data  } = await userFetchs.login(inputs);

      console.log(data)

      const { result: userData  } = await userFetchs.info(data.accessToken);

      dispatch(userActions.login({ ...userData, accessToken: data.accessToken }));
      setUserToken(data.accessToken)
    } catch (e: any) {
      console.log(e)
      failureNotification(e.response.data.message);
    }

    removeLoader();
  }

  return (
    <div className={s.loginContainer}>
      <h4 className={s.title}>{t(language, LOGIN_TEXTS.WELCOME)}</h4>
      <Field
        name='mail'
        type='text'
        value={inputs.mail}
        error={inputErrors.mail}
        onChange={handleFormChange}
        maxLength={255}
      />
      <Field
        name='password'
        type={showPassword ? 'text' : 'password'}
        value={inputs.password}
        error={inputErrors.password}
        onChange={handleFormChange}
        maxLength={30}
      />
      <div className={s.showPasswordContainer}>
        <input
          id="show-password"
          type="checkbox"
          checked={showPassword}
          onChange={() => setShowPassword(!showPassword)}
        />
        <label htmlFor='show-password' className={s.showPasswordLabel}>{t(language, LOGIN_TEXTS.SEE_PASSWORD)}</label>
      </div>
      <p className={s.text}>
        You don't have an account ? <a onClick={() => setMode(Mode.REGISTER)} className={s.signUp}>{t(language, LOGIN_TEXTS.SIGN_UP)}</a>
      </p>
      <button onClick={handleLogin} className={s.submitButton}>{t(language, LOGIN_TEXTS.LOGIN)}</button>
    </div>
  );
}