import { KeyboardEvent, useCallback, useRef } from 'react';
import { Mode } from '@/types/auth.type';
import s from './CodeVerification.module.css';
import { IoArrowBackSharp } from 'react-icons/io5';
import { CodeVerificationProps } from './CodeVerification.type';
import { addLoader, removeLoader } from '@/helpers/loaderFullScreen/loaderFullScreen';
import { failureNotification, succesNotification } from '@/helpers/notify';
import { COLORS } from '@/styles';
import { userFetchs } from '@/redux/actions/user';
import { DefaultResponse } from '@/types/const.type';

export default function CodeVerification({ registerData, setMode }: CodeVerificationProps) {
  const { current: inputRefs } = useRef<Array<HTMLInputElement | null>>(
    Array(6).fill(null)
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>, index: number) => {
      e.preventDefault()
      const targetInput = e.target as HTMLInputElement;

      if (e.key === "Backspace") {
        targetInput.value = ""

        if (index > 0) inputRefs[index - 1]?.focus();
      }

      if (/^\d/.test(e.key) && index < 6) {
        targetInput.value = e.key;

        inputRefs[index + 1]?.focus();
      }

      if (index === 5) inputRefs[index]?.blur();
    },

    []
  );

  const handleVerifyCode = useCallback(async () => {
    let code = "";

    inputRefs.forEach((input) => code += (input as HTMLInputElement).value);

    if (code.length !== 6) return;

    const { mail, password, username } = registerData;

    addLoader(COLORS.FOLLY);

    const resultCode = await userFetchs.verifyCode({ mail, code });

    inputRefs.forEach((input) => (input as HTMLInputElement).value = "");

    try {
      if (!resultCode)
        throw {
          title: "Failed Code",
          text: "The code you entered is incorrect."
        };

      const { ok } = await userFetchs.createUser({ mail, password, username }, resultCode) as any as DefaultResponse;

      if (!ok) throw "Some error occurred during registration. Please wait some time and try again."

      succesNotification("Now you can login and enjoy!")
    } catch (message: any) {
      failureNotification(message);
    } finally {
      removeLoader();
    }

  }, []);


  return (
    <div className={s.container}>
      <h4 className={s.title}>Code Verification</h4>
      <p className={s.description}>Please, check your email, in a few moments you'll receive a code to insert right here.</p>
      <div className={s.digits}>
        {
          inputRefs.map((_, index) => (
            <input
              className={s.digitInput}
              key={index}
              ref={input => inputRefs[index] = input}
              type="text"
              maxLength={1}
              onKeyDown={(e) => handleKeyDown(e, index)}
            />
          ))
        }
      </div>
      <button
        onClick={handleVerifyCode}
        className={s.validateButton}
      >validate</button>
      <IoArrowBackSharp
        onClick={() => setMode(Mode.LOGIN)}
        className={s.goBack}
      />
    </div>
  );
}