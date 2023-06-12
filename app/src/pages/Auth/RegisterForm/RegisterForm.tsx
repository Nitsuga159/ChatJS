import { ChangeEvent, SetStateAction, useEffect, useState } from 'react';
import { IoArrowBackSharp } from 'react-icons/io5';
import { UserRegister, UserRegisterKeys } from '@/types/user.type';
import { Mode } from '@/types/auth.type';
import userValidation from '@/validations/user.validation';
import s from './RegisterForm.module.css';
import { addLoader, removeLoader } from '@/helpers/loaderFullScreen/loaderFullScreen';
import { failureNotification } from '@/helpers/notify';
import Field from '@/components/Field';
import { COLORS } from '@/styles';
import { userFetchs } from '@/redux/actions/user';
import { DefaultResponse } from '@/types/const.type';

type RegisterFormProps = {
  setMode: (mode: SetStateAction<Mode>) => void,
  handleRegisterFormSubmit: (data: UserRegister) => void,
}

type Input = 'mail' | 'username' | 'password' | 'repeat-password';

export default function RegisterForm({
  handleRegisterFormSubmit,
  setMode
}: RegisterFormProps) {
  const [inputErrors, setInputErrors] = useState({
    mail: userValidation.mail(""),
    username: userValidation.username(""),
    password: userValidation.password(""),
    "repeat-password": userValidation['repeat-password']("", "")
  });
  const [inputs, setInputs] = useState<UserRegister>({
    mail: "",
    username: "",
    password: "",
    "repeat-password": ""
  });

  const handleFormChange = (value: string, name: string) => {
    setInputs(inputs => (
      {
        ...inputs,
        [name]: value
      }
    ));
    setInputErrors(errors => ({
      ...errors,
      [name]: userValidation[name as Input](value, inputs.password)
    }))
  };

  useEffect(() => {
    setInputErrors(errors => ({
      ...errors,
      "repeat-password": userValidation['repeat-password'](inputs['repeat-password'], inputs.password)
    }))
  }, [inputs]);

  const handleFormSubmit = async (e: any) => {
    e.preventDefault()

    const isError: boolean =
      Object.values(inputErrors)
        .some((error: string) => error !== "");

    if (isError) return;

    addLoader(COLORS.FOLLY);

    const { ok, error } = await userFetchs.createCodeVerification(inputs.mail) as any as DefaultResponse;

    if (ok) handleRegisterFormSubmit(inputs);
    else failureNotification(error!)

    removeLoader();
  };

  return (
    <form className={s.container} onSubmit={handleFormSubmit}>
      <h4 className={s.title}>SIGN UP</h4>
      {Object.keys(inputs).map((name: string) =>
        <Field
          key={name}
          name={name}
          type={name.includes("password") ? "password" : "text"}
          value={inputs[name as UserRegisterKeys]}
          error={inputErrors[name as UserRegisterKeys]}
          onChange={handleFormChange}
        />
      )}
      <button
        type="submit"
        className={s.submitButton}
      >send</button>
      <IoArrowBackSharp
        onClick={() => setMode(Mode.LOGIN)}
        className={s.goBack}
      />
    </form>
  );
}