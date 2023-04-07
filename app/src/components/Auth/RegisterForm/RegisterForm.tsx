import { ChangeEvent, SetStateAction, useEffect, useState } from 'react';
import { IoArrowBackSharp } from 'react-icons/io5';
import { UserRegister } from '@/types/user.type';
import { Mode } from '@/types/auth.type';
import { createCodeVerification } from '@/actions/user';
import userValidation from '@/Validations/user.validation';
import s from './RegisterForm.module.css';

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

  const handleFormChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputs(inputs => (
      {
        ...inputs,
        [e.target.name]: e.target.value
      }
    ));
    setInputErrors(errors => ({
      ...errors,
      [e.target.name]: userValidation[e.target.name as Input](e.target.value, inputs.password)
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

    const error: boolean =
      Object.values(inputErrors)
        .some((error: string) => error !== "");

    if (error) return;

    const result = await createCodeVerification(inputs.mail);

    if (result) handleRegisterFormSubmit(inputs);
  };

  return (
    <form className={s.container} onSubmit={handleFormSubmit}>
      <h4 className={s.title}>SIGN UP</h4>
      {Object.keys(inputs).map((key: string) => (
        <>
          <div className={s.textContainer}>
            <label className={s.label} htmlFor={key}>
              {key}
            </label>
            {
              inputErrors[key as Input] &&
              <p className={s.error}>{inputErrors[key as Input]}</p>
            }
          </div>
          <input
            className={s.input}
            type={key.includes("password") ? "password" : "text"}
            id={key}
            name={key}
            value={inputs[key as keyof typeof inputs]}
            onChange={handleFormChange}
            required
            onInvalid={(e) => { e.preventDefault(); }}
          />

        </>
      ))}
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