import { ChangeEvent, KeyboardEvent, useCallback, useEffect, useRef, useState } from 'react';
import { Mode } from '@/types/auth.type';
import { UserRegister } from '@/types/user.type';
import s from './CodeVerification.module.css';

type CodeVerificationProps = {
  registerData: UserRegister
}

export default function CodeVerification({ registerData }: CodeVerificationProps) {
  const { current: inputRefs } = useRef<Array<HTMLInputElement | null>>(
    Array(6).fill(null)
  );
  const [code, setCode] = useState<string>("");

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>, index: number) => {
      e.preventDefault()
      const targetInput = e.target as HTMLInputElement;

      if (e.key === "Backspace") {
        targetInput.value = ""
        setCode(code => code.slice(0, -1))
        if (index > 0) inputRefs[index - 1]?.focus();
      }

      if (/^\d/.test(e.key) && index < 6) {
        targetInput.value = e.key;
        setCode(code => code += e.key)
        inputRefs[index + 1]?.focus();
      }

      if (index === 5) inputRefs[index]?.blur();
    },

    [code]
  );


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
      <button>validate</button>
    </div>
  );
}